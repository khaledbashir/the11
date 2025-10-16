# AnythingLLM Integration - Complete Setup Guide

## 🎯 What Was Fixed

### 1. **Document Embedding Issue** ✅
**Problem**: Documents were uploaded to AnythingLLM but NOT embedded in the workspace vector database. They were just sitting in the "Documents" folder without being searchable by the AI.

**Solution**: Changed from `/workspace/{slug}/update` to `/workspace/{slug}/update-embeddings` endpoint.

**Files Changed**:
- `/root/the11/novel-editor-demo/apps/web/lib/anythingllm.ts`
  - `embedCompanyKnowledgeBase()` - Now properly embeds Social Garden KB
  - `embedSOWDocument()` - Now properly embeds SOW documents

### 2. **Master SOW Dashboard** 🆕
**What It Does**: A single workspace that contains ALL SOWs ever created. Acts as a smart analytics dashboard.

**Capabilities**:
- "How many SOWs have we sent this month?"
- "List all clients with SOWs over $50,000"
- "What's the total value of all proposals?"
- "Show me all SOWs that include HubSpot integration"
- "Give me the complete SOW for [Client Name]"
- "What's our average SOW value?"

**New Methods**:
- `getOrCreateMasterDashboard()` - Creates workspace: `sow-master-dashboard`
- `embedSOWEverywhere()` - Embeds SOW in BOTH client workspace AND master dashboard
- `setDashboardPrompt()` - Sets specialized analytics prompt

### 3. **Automatic Initialization** ✅
On app load, the master dashboard is automatically created and ready.

---

## 📚 How It Works Now

### When Creating a New Client Workspace:

1. **Folder Created** → Client Name (e.g., "AGGF")
2. **Workspace Created** → `aggf` slug in AnythingLLM
3. **Social Garden KB Uploaded** → Company knowledge base document
4. **KB Embedded** → `/update-embeddings` with KB document ID
5. **Workspace Prompt Set** → Client-facing AI assistant prompt

### When Embedding a SOW:

1. **SOW Converted** → HTML → Plain text with metadata
2. **Document Uploaded** → To AnythingLLM via `/document/raw-text`
3. **Embedded in Client Workspace** → `/update-embeddings` for client
4. **Embedded in Master Dashboard** → `/update-embeddings` for dashboard
5. **Both AI assistants can now answer questions about the SOW**

---

## 🔗 Key API Endpoints Used

### Document Upload
```
POST /api/v1/document/raw-text
Body: {
  textContent: string,
  metadata: { title, source, type }
}
Returns: { success: true, documentId: string }
```

### Embed Documents (THE CRITICAL ONE!)
```
POST /api/v1/workspace/{slug}/update-embeddings
Body: {
  adds: [documentId1, documentId2],
  deletes: []
}
```

### Workspace Creation
```
POST /api/v1/workspace/new
Body: { name: string, slug: string }
```

### Set Workspace Prompt
```
POST /api/v1/workspace/{slug}/update
Body: { openAiPrompt: string }
```

---

## 🎨 Workspace Structure

### Client Workspaces (One per client)
- **Name**: Client Name (e.g., "AGGF Property Group")
- **Slug**: `aggf-property-group`
- **Contains**:
  - Social Garden Company KB (embedded)
  - All SOWs for that client (embedded)
- **Prompt**: Client-facing assistant

### Master SOW Dashboard
- **Name**: "SOW Master Dashboard"
- **Slug**: `sow-master-dashboard`
- **Contains**:
  - ALL SOWs from ALL clients (embedded)
- **Prompt**: Analytics/dashboard assistant
- **Purpose**: Cross-client analytics and insights

---

## 🚀 Usage in Code

### Embed SOW to Client + Dashboard
```typescript
await anythingLLM.embedSOWEverywhere(
  workspaceSlug,      // Client's workspace
  sowTitle,           // "SOW: AGGF - HubSpot Integration"
  htmlContent,        // From editor
  {
    docId: currentDoc.id,
    clientName: "AGGF",
    createdAt: new Date().toISOString(),
    totalInvestment: 50000,
  }
);
```

### Access Master Dashboard
```typescript
const dashboardSlug = await anythingLLM.getOrCreateMasterDashboard();
// Now you can chat with the dashboard at:
// https://ahmad-anything-llm.840tjq.easypanel.host/workspace/sow-master-dashboard
```

---

## ✅ Testing Checklist

- [ ] Create new folder for client
- [ ] Check AnythingLLM - workspace created
- [ ] Check AnythingLLM - Social Garden KB is in Documents
- [ ] Move KB to workspace (or verify it's auto-embedded)
- [ ] Create SOW and click "Embed to AI"
- [ ] Check AnythingLLM - SOW document appears in client workspace
- [ ] Chat with client workspace - ask about SOW
- [ ] Check master dashboard - SOW should be there too
- [ ] Chat with dashboard - ask "How many SOWs do we have?"

---

## 🔧 Environment Setup

Make sure these are set in `.env`:
```
ANYTHINGLLM_BASE_URL=https://ahmad-anything-llm.840tjq.easypanel.host
ANYTHINGLLM_API_KEY=0G0WTZ3-6ZX4D20-H35VBRG-9059WPA
```

---

## 📊 Benefits

1. **Zero Manual Work**: KB is auto-embedded, no more dragging files
2. **Dual Embedding**: SOWs go to both client workspace AND master dashboard
3. **Analytics Ready**: Master dashboard can answer questions across all SOWs
4. **Persistent**: All documents are properly embedded in vector DB
5. **Searchable**: AI can find exact information in SOWs instantly

---

## 🎯 Next Steps

1. Test the embedding flow with a real client
2. Verify both workspaces receive the SOW
3. Test dashboard analytics queries
4. Add more metadata to SOWs (status, services, team members)
5. Create dashboard UI to visualize SOW analytics
