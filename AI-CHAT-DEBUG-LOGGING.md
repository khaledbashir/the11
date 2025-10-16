# AI Chat Debug Logging & Insert to Editor Fix

## Date: October 16, 2025

## ✅ CHANGES DEPLOYED - Server Running on Port 3005

## Issues Addressed

1. **Missing "Insert to Editor" button** - The button wasn't showing on AI assistant messages
2. **Unknown model usage** - Unclear which AI model/provider was being used for each chat
3. **Lack of debugging information** - No visibility into chat request/response flow

## Changes Made

### 1. Added `onInsertToEditor` Prop to AgentSidebar

**File: `/root/the11/novel-editor-demo/apps/web/app/page.tsx`**

Added the missing `onInsertToEditor` callback to the `AgentSidebar` component:

```tsx
<AgentSidebar
  // ... existing props
  isLoading={isChatLoading}
  onInsertToEditor={(content) => {
    console.log('📝 Inserting content to editor:', content.substring(0, 100) + '...');
    if (editorRef.current) {
      editorRef.current.commands.insertContent(content);
      console.log('✅ Content inserted successfully');
    } else {
      console.error('❌ Editor instance not available');
    }
  }}
/>
```

### 2. Enhanced Chat Request Logging

**File: `/root/the11/novel-editor-demo/apps/web/app/page.tsx`**

Added comprehensive logging to track which model is being used:

```tsx
console.log('🤖 ============ CHAT REQUEST START ============');
console.log('📤 Agent:', currentAgent.name);
console.log('🔧 Model:', currentAgent.model);
console.log('🌐 Provider:', useAnythingLLM ? 'AnythingLLM' : 'OpenRouter');
console.log('🎯 Endpoint:', endpoint);
console.log('💬 Message Count:', newMessages.length);
console.log('📝 System Prompt:', currentAgent.systemPrompt.substring(0, 100) + '...');
console.log('=============================================');
```

### 3. Enhanced Response Logging

Added detailed response structure logging:

```tsx
console.log('📥 Response Status:', response.status, response.statusText);
const data = await response.json();
console.log('📄 Response Data Structure:', {
  hasChoices: !!data.choices,
  choicesLength: data.choices?.length,
  hasMessage: !!data.choices?.[0]?.message,
  messageContent: data.choices?.[0]?.message?.content?.substring(0, 100),
  rawDataKeys: Object.keys(data)
});
console.log('📦 Full Response Data:', data);
```

### 4. Added AI Message Creation Logging

Track when AI messages are created and saved:

```tsx
console.log('✅ AI Message Created:', {
  id: aiMessage.id,
  role: aiMessage.role,
  contentLength: aiMessage.content.length,
  contentPreview: aiMessage.content.substring(0, 100) + '...'
});
// ... save to state and localStorage
console.log('💾 Chat messages saved to localStorage, total messages:', updatedMessages.length);
```

### 5. Added AgentSidebar Component Logging

**File: `/root/the11/novel-editor-demo/apps/web/components/tailwind/agent-sidebar-clean.tsx`**

Added useEffect to track prop availability:

```tsx
useEffect(() => {
  console.log('🔍 [AgentSidebar] onInsertToEditor prop:', onInsertToEditor ? 'Available ✅' : 'Missing ❌');
  console.log('🔍 [AgentSidebar] Chat messages count:', chatMessages.length);
  console.log('🔍 [AgentSidebar] Current agent ID:', currentAgentId);
}, [onInsertToEditor, chatMessages.length, currentAgentId]);
```

### 6. Added Message Render Logging

Track when each message is rendered and whether the button should show:

```tsx
chatMessages.map(msg => {
  const shouldShowButton = msg.role === 'assistant' && onInsertToEditor;
  if (msg.role === 'assistant') {
    console.log('🔍 [Message Render]', {
      msgId: msg.id,
      role: msg.role,
      hasOnInsertToEditor: !!onInsertToEditor,
      shouldShowButton,
      contentPreview: msg.content.substring(0, 50) + '...'
    });
  }
  // ... render message with button
})
```

### 7. Added Button Click Logging

```tsx
<Button 
  onClick={() => {
    console.log('🖱️ Insert to Editor button clicked');
    onInsertToEditor(msg.content);
  }}
>
  📝 Insert to Editor
</Button>
```

### 8. Fixed onUpdateAgent Signature Issue

Fixed the callback signature mismatch in EditAgentForm:

```tsx
onUpdateAgent={(updated) => {
  onUpdateAgent(updated.id, { 
    name: updated.name, 
    systemPrompt: updated.systemPrompt, 
    model: updated.model 
  });
  setShowSettings(false);
}}
```

## How to Use the Debug Logs

### To Check Which Model is Being Used:

1. Open browser console (F12)
2. Send a message to the AI agent
3. Look for the log section starting with:
   ```
   🤖 ============ CHAT REQUEST START ============
   ```
4. Check the following fields:
   - **🔧 Model:** Shows the exact model ID (e.g., `anythingllm`, `google/gemini-flash-1.5`)
   - **🌐 Provider:** Shows either "AnythingLLM" or "OpenRouter"
   - **🎯 Endpoint:** Shows the API endpoint being called

### To Debug Insert to Editor Button:

1. Open browser console
2. Check for these logs:
   - `🔍 [AgentSidebar] onInsertToEditor prop:` - Should say "Available ✅"
   - `🔍 [Message Render]` - Shows for each assistant message, includes `shouldShowButton` field
   - `🖱️ Insert to Editor button clicked` - Appears when you click the button
   - `📝 Inserting content to editor:` - Shows content being inserted
   - `✅ Content inserted successfully` - Confirms insertion worked

### To Debug Response Issues:

Look for these logs after sending a message:
- `📥 Response Status:` - HTTP status code
- `📄 Response Data Structure:` - Shows if response has expected structure
- `📦 Full Response Data:` - Complete API response
- `✅ AI Message Created:` - Shows the message that will be displayed

## Expected Console Output

When everything is working correctly, you should see:

```
🤖 ============ CHAT REQUEST START ============
📤 Agent: Architect
🔧 Model: anythingllm
🌐 Provider: AnythingLLM
🎯 Endpoint: /api/anythingllm/chat
💬 Message Count: 2
📝 System Prompt: You are an expert SOW architect...
=============================================
📥 Response Status: 200 OK
📄 Response Data Structure: {...}
📦 Full Response Data: {...}
✅ AI Message Created: {...}
💾 Chat messages saved to localStorage, total messages: 3
🔍 [AgentSidebar] onInsertToEditor prop: Available ✅
🔍 [Message Render] {...shouldShowButton: true}
```

## Testing

1. **Open the app** - Navigate to http://localhost:3001
2. **Open Console** - Press F12 to open browser DevTools
3. **Open AI Sidebar** - Click the "AI" button in bottom right
4. **Select an agent** - Choose "Architect" or any agent
5. **Send a message** - Type a question and send
6. **Watch the logs** - See all debug information in console
7. **Check for button** - After AI responds, you should see "📝 Insert to Editor" button
8. **Click button** - Should insert content into editor and log the action

## Troubleshooting

### Button Still Not Showing?

Check console for:
- `🔍 [AgentSidebar] onInsertToEditor prop: Missing ❌` → The prop isn't being passed
- `🔍 [Message Render] shouldShowButton: false` → Either not assistant message or prop missing

### Content Not Inserting?

Check console for:
- `❌ Editor instance not available` → Editor ref is null
- No log after clicking button → Button click handler not firing

### Wrong Model Being Used?

Check the `🔧 Model:` and `🌐 Provider:` logs in the request section to see exactly what's configured.

## Files Modified

1. `/root/the11/novel-editor-demo/apps/web/app/page.tsx`
   - Added `onInsertToEditor` prop to AgentSidebar
   - Added comprehensive chat logging
   - Added response structure logging
   - Added AI message creation logging

2. `/root/the11/novel-editor-demo/apps/web/components/tailwind/agent-sidebar-clean.tsx`
   - Added prop availability logging
   - Added message render logging
   - Added button click logging
   - Fixed onUpdateAgent callback signature

## Next Steps

If you still don't see the button or have model issues:

1. Check all console logs for errors or warnings
2. Verify the agent is configured with the correct model
3. Ensure you're in editor view mode (`viewMode === 'editor'`)
4. Check that editorRef.current is not null
5. Share the console output for further debugging
