# 🚀 AnythingLLM Integration Plan - Complete Implementation

**Created:** October 16, 2025  
**Objective:** Replace OpenRouter with AnythingLLM API for both Editor AI and Sidebar AI

---

## 📋 Current State Analysis

### What We Have Now:

1. **Editor AI (Pop-up AI Selector)**
   - Location: `/app/api/generate/route.ts`
   - Uses: OpenRouter API directly
   - Features: improve, fix, shorter, longer, continue, zap
   - Streaming: ✅ Yes (SSE format)

2. **Sidebar AI (Agent Chat)**
   - Location: `/app/api/chat/route.ts`
   - Uses: OpenRouter API directly
   - Features: Full chat with agents
   - Streaming: ❌ No (single response)

3. **AnythingLLM Instance**
   - Base URL: `https://ahmad-anything-llm.840tjq.easypanel.host`
   - API Docs: Available at `/api/docs`
   - Authentication: Bearer token required
   - Workspaces: Separate knowledge bases per use case

---

## 🎯 Integration Strategy

### Option 1: Direct API Integration (Recommended) ✅

**Why This Approach:**
- Full control over responses
- Can use workspace-specific knowledge bases
- Better for custom UI/UX
- More flexible for streaming

**Architecture:**
```
Editor/Sidebar → Our API Route → AnythingLLM API → Response
                  (transforms)     (workspace chat)
```

### Option 2: Embedded Widget

**Why NOT Recommended:**
- Limited customization
- Can't integrate into existing UI
- Separate iframe/window experience
- No programmatic control

---

## 🏗️ Implementation Plan

### Phase 1: Setup AnythingLLM Workspaces 🔲

#### Step 1.1: Create Workspaces via UI
```bash
# Access AnythingLLM at:
https://ahmad-anything-llm.840tjq.easypanel.host

# Create these workspaces:
1. "Editor AI" - For pop-up AI selector
2. "Agent Chat" - For sidebar conversations
```

#### Step 1.2: Get API Keys
```javascript
// Navigate to Settings → API Keys
// Create keys:
- ANYTHINGLLM_EDITOR_KEY (for editor AI)
- ANYTHINGLLM_AGENT_KEY (for agent chat)
```

#### Step 1.3: Configure Workspace Knowledge Bases
```
Editor AI Workspace:
- Upload: Social Garden style guide
- Upload: Writing best practices
- Upload: SOW templates

Agent Chat Workspace:
- Upload: Social Garden rate card
- Upload: Service offerings
- Upload: SOW examples
- Upload: Client communication templates
```

---

### Phase 2: Environment Configuration 🔲

#### Update `.env.local`
```bash
# AnythingLLM Configuration
ANYTHINGLLM_BASE_URL=https://ahmad-anything-llm.840tjq.easypanel.host
ANYTHINGLLM_EDITOR_API_KEY=your-editor-api-key-here
ANYTHINGLLM_AGENT_API_KEY=your-agent-api-key-here

# Workspace IDs (get from UI)
ANYTHINGLLM_EDITOR_WORKSPACE=editor-ai
ANYTHINGLLM_AGENT_WORKSPACE=agent-chat

# Keep OpenRouter as fallback
OPENROUTER_API_KEY=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
```

---

### Phase 3: Create AnythingLLM Client Library 🔲

#### Create `/lib/anythingllm-client.ts`
```typescript
/**
 * AnythingLLM Client Library
 * Handles all communication with AnythingLLM API
 */

interface AnythingLLMConfig {
  baseURL: string;
  apiKey: string;
  workspaceSlug: string;
}

export class AnythingLLMClient {
  private config: AnythingLLMConfig;

  constructor(config: AnythingLLMConfig) {
    this.config = config;
  }

  /**
   * Send a chat message to workspace
   * @param message - User message
   * @param mode - 'chat' or 'query'
   * @returns AI response
   */
  async chat(message: string, mode: 'chat' | 'query' = 'chat') {
    const response = await fetch(
      `${this.config.baseURL}/api/v1/workspace/${this.config.workspaceSlug}/chat`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          mode,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`AnythingLLM API error: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Stream chat response (for real-time UI)
   * @param message - User message
   * @param onChunk - Callback for each chunk
   */
  async *streamChat(message: string) {
    const response = await fetch(
      `${this.config.baseURL}/api/v1/workspace/${this.config.workspaceSlug}/stream-chat`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          mode: 'chat',
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`AnythingLLM API error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('No response body');
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      yield chunk;
    }
  }

  /**
   * Get chat history
   */
  async getChatHistory() {
    const response = await fetch(
      `${this.config.baseURL}/api/v1/workspace/${this.config.workspaceSlug}/chats`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      }
    );

    return response.json();
  }
}

// Factory functions
export function createEditorAIClient(): AnythingLLMClient {
  return new AnythingLLMClient({
    baseURL: process.env.ANYTHINGLLM_BASE_URL!,
    apiKey: process.env.ANYTHINGLLM_EDITOR_API_KEY!,
    workspaceSlug: process.env.ANYTHINGLLM_EDITOR_WORKSPACE!,
  });
}

export function createAgentChatClient(): AnythingLLMClient {
  return new AnythingLLMClient({
    baseURL: process.env.ANYTHINGLLM_BASE_URL!,
    apiKey: process.env.ANYTHINGLLM_AGENT_API_KEY!,
    workspaceSlug: process.env.ANYTHINGLLM_AGENT_WORKSPACE!,
  });
}
```

---

### Phase 4: Update Editor AI API Route 🔲

#### Modify `/app/api/generate/route.ts`

**Changes Required:**
1. Import AnythingLLM client
2. Transform editor commands to chat messages
3. Handle streaming response
4. Add fallback to OpenRouter

```typescript
import { createEditorAIClient } from '@/lib/anythingllm-client';
import { NextRequest } from 'next/server';
import { match } from "ts-pattern";

export const runtime = "edge";

export async function POST(req: NextRequest): Promise<Response> {
  const { prompt, option, command } = await req.json();

  // Transform editor command to natural language prompt
  const systemMessage = match(option)
    .with("continue", () => 
      "Continue this text naturally, maintaining the same tone and style."
    )
    .with("improve", () => 
      "Improve this text for better clarity and readability."
    )
    .with("shorter", () => 
      "Make this text more concise while keeping the key points."
    )
    .with("longer", () => 
      "Expand this text with more detail and explanation."
    )
    .with("fix", () => 
      "Fix grammar and spelling errors in this text."
    )
    .with("zap", () => 
      `${command}`
    )
    .run();

  const fullMessage = `${systemMessage}\n\nText: ${prompt}`;

  try {
    // Try AnythingLLM first
    const client = createEditorAIClient();
    
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of client.streamChat(fullMessage)) {
            // Transform to AI SDK format
            const formatted = `0:"${chunk}"\n`;
            controller.enqueue(encoder.encode(formatted));
          }
          controller.close();
        } catch (error) {
          console.error('AnythingLLM streaming error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });

  } catch (error) {
    console.error('AnythingLLM error, falling back to OpenRouter:', error);
    
    // Fallback to OpenRouter (existing code)
    // ... keep existing OpenRouter implementation ...
  }
}
```

---

### Phase 5: Update Sidebar AI API Route 🔲

#### Modify `/app/api/chat/route.ts`

**Changes Required:**
1. Use AnythingLLM agent workspace
2. Maintain chat history context
3. Support streaming responses
4. Add agent-specific system prompts

```typescript
import { createAgentChatClient } from '@/lib/anythingllm-client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('🔵 [API /api/chat] Request received');
  
  const { messages, model, agentName, agentPrompt } = await request.json();

  try {
    const client = createAgentChatClient();

    // Combine agent prompt with user message
    const lastMessage = messages[messages.length - 1];
    const contextualMessage = `
System: ${agentPrompt || 'You are a helpful AI assistant.'}

User: ${lastMessage.content}
    `.trim();

    // Get response from AnythingLLM
    const response = await client.chat(contextualMessage, 'chat');

    return NextResponse.json({
      id: response.id || Date.now().toString(),
      choices: [{
        message: {
          role: 'assistant',
          content: response.textResponse || response.response,
        },
        finish_reason: 'stop',
      }],
      sources: response.sources || [],
    });

  } catch (error) {
    console.error('AnythingLLM chat error:', error);
    
    // Fallback to OpenRouter
    return fallbackToOpenRouter(messages, model);
  }
}

async function fallbackToOpenRouter(messages: any[], model: string) {
  // Keep existing OpenRouter implementation
  // ...
}
```

---

### Phase 6: Update Frontend Components 🔲

#### Changes to `ai-selector.tsx` (Editor AI)

**No changes needed!** ✅  
The component already uses the `/api/generate` endpoint via `useCompletion` hook.

#### Changes to `agent-sidebar-clean.tsx` (Sidebar AI)

**Minor changes:**
1. Pass agent info to API
2. Handle sources from response
3. Add "Knowledge Base" indicator

```typescript
// In handleSendMessage function:
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [...chatMessages, { role: 'user', content: chatInput }],
    model: currentAgent.model,
    agentName: currentAgent.name,
    agentPrompt: currentAgent.systemPrompt,
  }),
});

const data = await response.json();

// Show sources if available
if (data.sources && data.sources.length > 0) {
  console.log('📚 Knowledge base sources:', data.sources);
  // TODO: Display sources in UI
}
```

---

### Phase 7: Add Knowledge Base UI 🔲

#### Create Knowledge Base Indicator Component

```typescript
// components/tailwind/knowledge-base-indicator.tsx
export function KnowledgeBaseIndicator({ 
  sources 
}: { 
  sources?: string[] 
}) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
      <BookOpen className="h-3 w-3" />
      <span>Used {sources.length} knowledge base document(s)</span>
    </div>
  );
}
```

#### Add to Chat Messages

```typescript
{msg.sources && (
  <KnowledgeBaseIndicator sources={msg.sources} />
)}
```

---

## 🔒 Security Considerations

### API Key Management
```typescript
// ✅ Good: Server-side only
const apiKey = process.env.ANYTHINGLLM_EDITOR_API_KEY;

// ❌ Bad: Never expose in client
// const apiKey = "sk-..."; 
```

### Rate Limiting
```typescript
// Add rate limiting per user/IP
import { Ratelimit } from "@upstash/ratelimit";

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(50, "1 d"),
});
```

### Input Sanitization
```typescript
// Sanitize user input
function sanitizeInput(input: string): string {
  return input
    .replace(/<script>/gi, '')
    .replace(/javascript:/gi, '')
    .trim();
}
```

---

## 📊 Monitoring & Analytics

### Track Usage
```typescript
// Add analytics to API routes
import { track } from '@/lib/analytics';

track('anythingllm_chat', {
  workspace: 'editor-ai',
  action: option,
  success: true,
  latency: endTime - startTime,
});
```

### Error Logging
```typescript
// Structured error logging
console.error('[AnythingLLM]', {
  error: error.message,
  workspace: workspaceSlug,
  timestamp: new Date().toISOString(),
});
```

---

## 🧪 Testing Plan

### Phase 1: Local Testing
1. Set up environment variables
2. Test Editor AI commands:
   - ✅ improve
   - ✅ fix
   - ✅ shorter
   - ✅ longer
   - ✅ continue
   - ✅ zap
3. Test Sidebar chat:
   - ✅ Basic questions
   - ✅ SOW generation
   - ✅ Knowledge base queries

### Phase 2: Integration Testing
1. Test fallback to OpenRouter
2. Test streaming responses
3. Test error handling
4. Test rate limiting

### Phase 3: Production Testing
1. Monitor API usage
2. Check response times
3. Verify knowledge base accuracy
4. Collect user feedback

---

## 🚀 Deployment Steps

### Step 1: Backup Current System
```bash
git checkout -b backup-before-anythingllm
git add .
git commit -m "Backup before AnythingLLM integration"
git push origin backup-before-anythingllm
```

### Step 2: Create Feature Branch
```bash
git checkout -b feature/anythingllm-integration
```

### Step 3: Implement Changes
```bash
# Follow phases 1-7 above
```

### Step 4: Test Locally
```bash
pnpm dev
# Test all features
```

### Step 5: Deploy to Staging
```bash
git add .
git commit -m "feat: Integrate AnythingLLM for Editor and Sidebar AI"
git push origin feature/anythingllm-integration
```

### Step 6: Merge to Production
```bash
git checkout production-ready
git merge feature/anythingllm-integration
git push origin production-ready
```

---

## 🎯 Success Metrics

### Performance
- ✅ Response time < 2s for editor AI
- ✅ Response time < 3s for sidebar chat
- ✅ Streaming works smoothly

### Accuracy
- ✅ Knowledge base queries return relevant info
- ✅ Editor commands produce expected results
- ✅ SOW generation includes rate card info

### User Experience
- ✅ No breaking changes to existing UI
- ✅ Seamless fallback to OpenRouter
- ✅ Clear error messages

---

## 📚 Documentation Updates Needed

1. **README.md** - Add AnythingLLM setup instructions
2. **API-REFERENCE.md** - Document new endpoints
3. **DEPLOYMENT.md** - Add environment variables
4. **USER-GUIDE.md** - Explain knowledge base features

---

## 🔄 Rollback Plan

If issues occur:

1. **Immediate Rollback**
   ```bash
   git checkout backup-before-anythingllm
   git push origin production-ready --force
   ```

2. **Fallback to OpenRouter**
   - Already built into the code
   - If AnythingLLM fails, OpenRouter takes over automatically

3. **Emergency Environment Variable**
   ```bash
   USE_OPENROUTER_ONLY=true
   ```

---

## 📝 Next Steps

1. ✅ Review this plan with team
2. 🔲 Set up AnythingLLM workspaces
3. 🔲 Create API keys
4. 🔲 Upload knowledge base documents
5. 🔲 Implement client library
6. 🔲 Update API routes
7. 🔲 Test thoroughly
8. 🔲 Deploy to production

---

## 🎉 Expected Benefits

### For Users:
- 📚 **Smarter AI** - Access to Social Garden knowledge base
- ⚡ **Faster Responses** - Optimized for our use case
- 🎯 **More Accurate** - Context-aware from uploaded documents
- 🔒 **More Secure** - Self-hosted on our infrastructure

### For Developers:
- 🛠️ **Better Control** - Full API access
- 📊 **Better Monitoring** - Track usage and performance
- 🔧 **Easier Debugging** - Clear error messages
- 💰 **Cost Effective** - No per-token pricing

---

## 💡 Future Enhancements

### Phase 2 Features:
1. **Document Upload** - Users can upload their own docs to workspace
2. **Thread History** - Save and restore conversation threads
3. **Multi-Agent** - Different agents for different tasks
4. **Voice Input** - Speech-to-text integration
5. **Export Chats** - Download conversation history

### Phase 3 Features:
1. **Custom Training** - Fine-tune on company data
2. **API Analytics Dashboard** - Real-time usage stats
3. **A/B Testing** - Compare different prompts/models
4. **Webhooks** - Real-time notifications for events

---

**Ready to implement?** Let's start with Phase 1! 🚀
