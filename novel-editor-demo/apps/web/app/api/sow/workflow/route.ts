import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const ANYTHINGLLM_URL = process.env.ANYTHINGLLM_URL || 'https://ahmad-anything-llm.840tjq.easypanel.host';
const ANYTHINGLLM_API_KEY = process.env.ANYTHINGLLM_API_KEY || '0G0WTZ3-6ZX4D20-H35VBRG-9059WPA';

/**
 * 🔥 MASTER SOW WORKFLOW 🔥
 * 
 * This endpoint orchestrates the complete SOW workflow:
 * 1. Create/get client-specific AnythingLLM workspace
 * 2. Embed SOW content to client workspace
 * 3. Embed SOW content to master dashboard workspace
 * 4. Generate custom embed code (unbranded Social Garden theme)
 * 5. Store everything in database
 * 6. Return embed code for client portal
 */

export async function POST(request: NextRequest) {
  try {
    const { sowId, clientName, sowTitle, sowContent } = await request.json();

    if (!sowId || !clientName || !sowTitle || !sowContent) {
      return NextResponse.json(
        { error: 'Missing required fields: sowId, clientName, sowTitle, sowContent' },
        { status: 400 }
      );
    }

    console.log('🚀 [SOW Workflow] Starting workflow for:', clientName);

    // Step 1: Create or get client workspace
    const clientWorkspaceSlug = await createClientWorkspace(clientName);
    console.log('✅ [SOW Workflow] Client workspace:', clientWorkspaceSlug);

    // Step 2: Embed SOW to client workspace
    await embedSOWToWorkspace(clientWorkspaceSlug, sowTitle, sowContent);
    console.log('✅ [SOW Workflow] Embedded to client workspace');

    // Step 3: Embed SOW to master dashboard workspace
    await embedSOWToWorkspace('sow-master-dashboard', sowTitle, sowContent);
    console.log('✅ [SOW Workflow] Embedded to master dashboard');

    // Step 4: Generate custom embed code
    const embedCode = await generateCustomEmbedCode(clientWorkspaceSlug, clientName);
    console.log('✅ [SOW Workflow] Generated embed code');

    // Step 5: Store in database
    await db.query(
      `UPDATE sows 
       SET anythingllm_workspace_slug = ?, 
           embed_code = ?,
           embedded_at = NOW(),
           updated_at = NOW()
       WHERE id = ?`,
      [clientWorkspaceSlug, embedCode, sowId]
    );
    console.log('✅ [SOW Workflow] Updated database');

    // Step 6: Log activity
    await db.query(
      `INSERT INTO sow_activities (sow_id, activity_type, description, created_at)
       VALUES (?, 'embedded', ?, NOW())`,
      [sowId, `SOW embedded to workspace: ${clientWorkspaceSlug} and master dashboard`]
    );

    return NextResponse.json({
      success: true,
      workspaceSlug: clientWorkspaceSlug,
      embedCode,
      message: `SOW successfully embedded to ${clientWorkspaceSlug} and master dashboard`
    });

  } catch (error: any) {
    console.error('❌ [SOW Workflow] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Workflow failed' },
      { status: 500 }
    );
  }
}

/**
 * Create or get a client-specific workspace
 */
async function createClientWorkspace(clientName: string): Promise<string> {
  // Generate slug from client name
  const slug = `client-${clientName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  try {
    // Check if workspace already exists
    const checkResponse = await fetch(`${ANYTHINGLLM_URL}/api/v1/workspace/${slug}`, {
      headers: {
        'Authorization': `Bearer ${ANYTHINGLLM_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (checkResponse.ok) {
      console.log(`   Workspace ${slug} already exists`);
      return slug;
    }

    // Create new workspace
    console.log(`   Creating workspace ${slug}...`);
    const createResponse = await fetch(`${ANYTHINGLLM_URL}/api/v1/workspace/new`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ANYTHINGLLM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `${clientName} Workspace`,
        slug,
      }),
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      throw new Error(`Failed to create workspace: ${errorText}`);
    }

    const data = await createResponse.json();
    console.log(`   ✅ Created workspace: ${slug}`);
    return data.workspace?.slug || slug;

  } catch (error: any) {
    console.error(`   ❌ Error creating workspace:`, error);
    throw error;
  }
}

/**
 * Embed SOW content as a document to a workspace
 */
async function embedSOWToWorkspace(workspaceSlug: string, sowTitle: string, sowContent: string): Promise<void> {
  try {
    // Upload as raw text document
    const uploadResponse = await fetch(`${ANYTHINGLLM_URL}/api/v1/document/raw-text`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ANYTHINGLLM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        textContent: sowContent,
        metadata: {
          title: sowTitle,
          docAuthor: 'Social Garden',
          description: `Statement of Work: ${sowTitle}`,
        },
      }),
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`Failed to upload document: ${errorText}`);
    }

    const uploadData = await uploadResponse.json();
    const documentLocation = uploadData.documents?.[0]?.location;

    if (!documentLocation) {
      throw new Error('No document location returned from upload');
    }

    console.log(`   📄 Document uploaded: ${documentLocation}`);

    // Add document to workspace
    const addResponse = await fetch(`${ANYTHINGLLM_URL}/api/v1/workspace/${workspaceSlug}/update-embeddings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ANYTHINGLLM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        adds: [documentLocation],
      }),
    });

    if (!addResponse.ok) {
      const errorText = await addResponse.text();
      throw new Error(`Failed to add document to workspace: ${errorText}`);
    }

    console.log(`   ✅ Document added to ${workspaceSlug}`);

  } catch (error: any) {
    console.error(`   ❌ Error embedding to ${workspaceSlug}:`, error);
    throw error;
  }
}

/**
 * Generate custom embed code with Social Garden branding
 */
async function generateCustomEmbedCode(workspaceSlug: string, clientName: string): Promise<string> {
  try {
    // Create embed configuration
    const createEmbedResponse = await fetch(`${ANYTHINGLLM_URL}/api/v1/embed/new`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ANYTHINGLLM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        workspaceId: workspaceSlug,
        max_chats_per_day: 50,
        max_chats_per_session: 20,
        allowlist_domains: [], // Empty = allow all
      }),
    });

    if (!createEmbedResponse.ok) {
      const errorText = await createEmbedResponse.text();
      throw new Error(`Failed to create embed: ${errorText}`);
    }

    const embedData = await createEmbedResponse.json();
    const embedId = embedData.embed?.uuid;

    if (!embedId) {
      throw new Error('No embed ID returned');
    }

    console.log(`   🎨 Embed created: ${embedId}`);

    // Generate custom embed code with Social Garden theme
    const embedCode = `<!--
Social Garden AI Assistant for ${clientName}
Powered by AnythingLLM | Customized for ${clientName}
-->
<script
  data-embed-id="${embedId}"
  data-base-api-url="${ANYTHINGLLM_URL}/api/embed"
  data-chat-icon="support"
  data-button-color="#20e28f"
  data-user-bg-color="#1b5e5e"
  data-assistant-bg-color="#0e2e33"
  data-brand-image-url="https://yourdomain.com/social-garden-logo.png"
  data-greeting="👋 Hi! I'm your AI assistant for this proposal. Ask me anything about the scope, timeline, pricing, or deliverables."
  data-no-sponsor="true"
  data-assistant-name="Social Garden AI"
  data-position="bottom-right"
  data-window-height="700px"
  data-window-width="400px"
  data-text-size="14"
  data-send-message-text="Ask about this proposal..."
  data-reset-chat-text="Start new conversation"
  data-default-messages="What's included in this proposal?, How long will this project take?, Can you explain the pricing?"
  src="${ANYTHINGLLM_URL}/embed/anythingllm-chat-widget.min.js">
</script>`;

    return embedCode;

  } catch (error: any) {
    console.error(`   ❌ Error generating embed code:`, error);
    throw error;
  }
}

/**
 * GET endpoint to retrieve embed code for a SOW
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sowId = searchParams.get('sowId');

    if (!sowId) {
      return NextResponse.json(
        { error: 'Missing sowId parameter' },
        { status: 400 }
      );
    }

    const [rows] = await db.query(
      `SELECT anythingllm_workspace_slug, embed_code, embedded_at 
       FROM sows 
       WHERE id = ?`,
      [sowId]
    ) as any;

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: 'SOW not found' },
        { status: 404 }
      );
    }

    const sow = rows[0];

    return NextResponse.json({
      workspaceSlug: sow.anythingllm_workspace_slug,
      embedCode: sow.embed_code,
      embeddedAt: sow.embedded_at,
    });

  } catch (error: any) {
    console.error('❌ [SOW Workflow GET] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve embed code' },
      { status: 500 }
    );
  }
}
