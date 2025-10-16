# AnythingLLM API & Embed Widget Reference

**Base URL**: `https://ahmad-anything-llm.840tjq.easypanel.host`

## Overview

AnythingLLM is our AI chat backend. Each **workspace** has its own knowledge base and can be embedded as a chat widget on client portals.

## Key Concepts

1. **Workspace** = A container for documents, chat history, and settings
2. **Embed ID** = Unique identifier for embedding a workspace chat widget
3. **Workspace Slug** = URL-friendly workspace identifier (e.g., "client-name")

---

## Embed Widget Integration

### The Problem with Default Embed
The AnythingLLM embed widget shows **"AnythingLLM"** branding by default. We want to hide this.

### Embed Script Format
```html
<script
  data-embed-id="83d1f002-449c-405d-8c5a-796fd64f2872"
  data-base-api-url="https://ahmad-anything-llm.840tjq.easypanel.host/api/embed"
  src="https://ahmad-anything-llm.840tjq.easypanel.host/embed/anythingllm-chat-widget.min.js">
</script>
```

### Customization Options

#### Branding (Remove AnythingLLM)
- `data-no-sponsor` - Hides the sponsor/branding footer
- `data-no-header` - Hides the header
- `data-assistant-name="Social Garden AI"` - Changes assistant name
- `data-brand-image-url` - Your logo URL

#### Styling
- `data-button-color="#0e2e33"` - Chat bubble color (hex)
- `data-user-bg-color="#20e28f"` - User message background
- `data-assistant-bg-color="#1B1B1E"` - AI message background
- `data-chat-icon` - Options: `plus`, `chatBubble`, `support`, `search2`, `search`, `magic`
- `data-window-height="600px"` - Height (must include px/rem/%)
- `data-window-width="400px"` - Width (must include px/rem/%)
- `data-text-size="14"` - Text size in pixels

#### Behavior
- `data-open-on-load="on"` - Auto-open chat on page load
- `data-position` - Options: `bottom-right`, `bottom-left`, `top-right`, `top-left`
- `data-default-messages="What's the total?,How many hours?"` - Suggested questions (comma-separated)
- `data-greeting="Hi! Ask me about this proposal"` - Initial message

#### Advanced
- `data-prompt` - Override system prompt
- `data-model` - Override LLM model
- `data-temperature` - Override temperature
- `data-username="Client Name"` - Track who's chatting
- `data-support-email="support@socialgarden.com.au"` - Shows support option

---

## API Endpoints

### Workspace Chat API
**POST** `/api/v1/workspace/{workspace-slug}/chat`

Send messages to a workspace and get AI responses.

**Request Body:**
```json
{
  "message": "What's the total investment?",
  "mode": "chat"
}
```

**Response:**
```json
{
  "id": "msg-uuid",
  "type": "textResponse",
  "textResponse": "The total investment is $50,000 AUD...",
  "sources": [],
  "close": false,
  "error": null
}
```

### Embed Chat API
**POST** `/api/embed/{embed-id}/chat`

Used by the embed widget. Similar to workspace chat but uses embed ID.

**Request Body:**
```json
{
  "message": "Your question here",
  "sessionId": "random-session-id"
}
```

### Get Workspaces
**GET** `/api/v1/workspaces`

List all workspaces.

**Headers:**
```
Authorization: Bearer {API_KEY}
```

**Response:**
```json
{
  "workspaces": [
    {
      "id": 1,
      "name": "Client Name",
      "slug": "client-name",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Create Workspace
**POST** `/api/v1/workspace/new`

Create a new workspace for a client.

**Request Body:**
```json
{
  "name": "Client Name",
  "slug": "client-name"
}
```

### Get Embed Settings
**GET** `/api/embed/{embed-id}/settings`

Get embed configuration for a workspace.

---

## Our Implementation Strategy

### Current Approach (BROKEN)
- ❌ Tried loading embed script dynamically
- ❌ Embed widget not rendering properly
- ❌ Wrong API URL was being used

### New Approach (WORKING)
1. **Custom Chat Component** - Built our own `ClientAIChat` component
2. **Direct API Calls** - POST to `/api/v1/workspace/{slug}/chat`
3. **No Embed Script** - Avoids branding issues entirely
4. **Full Control** - Match our design system perfectly

### API Integration Code
```typescript
// /api/ai/chat/route.ts
const response = await fetch(
  `https://ahmad-anything-llm.840tjq.easypanel.host/api/v1/workspace/${workspaceSlug}/chat`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.ANYTHINGLLM_API_KEY}`
    },
    body: JSON.stringify({
      message: userMessage,
      mode: 'chat'
    })
  }
);
```

---

## Environment Variables Required

```bash
ANYTHINGLLM_API_KEY=your_api_key_here
ANYTHINGLLM_BASE_URL=https://ahmad-anything-llm.840tjq.easypanel.host
```

---

## Workspace Automation

### When Creating a New Client (Workspace)
1. Generate workspace slug from client name (e.g., "Acme Corp" → "acme-corp")
2. Call POST `/api/v1/workspace/new` with name and slug
3. Store workspace slug in database with the client/folder
4. Enable chat embed for the workspace in AnythingLLM admin
5. Get embed ID and store it (optional, we're not using embeds)

### When Creating a New SOW
1. SOW belongs to a workspace (via folderId → folder.workspaceSlug)
2. Upload SOW content to workspace knowledge base
3. SOW becomes searchable in that workspace's chat

### When Client Accesses Portal
1. Load SOW with workspaceSlug from database
2. Custom chat component uses workspaceSlug to call API
3. AI has access to all documents in that workspace

---

## Security Notes

- ✅ API key is server-side only (never exposed to client)
- ✅ Workspace isolation - clients only access their workspace
- ✅ Rate limiting should be configured in AnythingLLM
- ✅ Session tracking via random IDs

---

## References

- **API Docs**: https://ahmad-anything-llm.840tjq.easypanel.host/api/doc
- **Embed Widget Docs**: https://github.com/Mintplex-Labs/anythingllm-embed/blob/main/README.md
- **Main Repo**: https://github.com/Mintplex-Labs/anything-llm
