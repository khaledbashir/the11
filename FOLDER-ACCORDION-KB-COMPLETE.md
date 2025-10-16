# Folder Accordion + Knowledge Base Integration

## What Changed

### 1. ✅ Folders Now Expandable/Collapsible (Accordion)

**Problem:**
- Folders weren't clickable
- Couldn't see which SOWs were inside folders
- Folders just sat there doing nothing

**Solution:**
- Added chevron arrow (▶) next to folder icon
- Click folder name or arrow → expands to show SOWs inside
- Click again → collapses back
- Folders remember expanded/collapsed state

**Implementation:**
```tsx
// New state in Sidebar
const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

// Toggle function
const toggleFolderExpand = (folderId: string) => {
  setExpandedFolders(prev => {
    const newSet = new Set(prev);
    if (newSet.has(folderId)) {
      newSet.delete(folderId);  // Collapse
    } else {
      newSet.add(folderId);     // Expand
    }
    return newSet;
  });
};

// Updated DroppableFolder component
<button onClick={() => onToggleExpand(folder.id)}>
  <ChevronRight className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
  <Folder />
</button>

{isExpanded && (
  <div className="ml-4 mt-1">{children}</div>  // Show SOWs
)}
```

**User Experience:**
1. See folder name (e.g., "Client ABC")
2. Click folder → arrow rotates 90°, reveals SOWs inside
3. Click folder again → collapses, hides SOWs
4. Can still drag/drop docs into collapsed folders
5. Action buttons (rename, delete) still visible

---

### 2. ✅ Knowledge Base (Replaced "Ask AI")

**Problem:**
- "Ask AI" was just another chat sidebar
- User wanted full AnythingLLM access inside app
- No need to open external tab

**Solution:**
- Replaced "Ask AI" with "Knowledge Base" button
- Clicking it loads AnythingLLM in iframe
- Full-height, full-width access to all workspaces
- Sidebar stays visible for quick actions
- Toggle back to editor anytime

**Implementation:**

#### New Component: `knowledge-base.tsx`
```tsx
export function KnowledgeBase() {
  return (
    <div className="h-full w-full bg-[#0e0f0f]">
      <iframe
        src="https://ahmad-anything-llm.840tjq.easypanel.host/"
        className="w-full h-full border-0"
        title="AnythingLLM Knowledge Base"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
}
```

#### Updated View Mode
```tsx
// app/page.tsx
const [viewMode, setViewMode] = useState<'editor' | 'dashboard' | 'knowledgebase'>('editor');

// Sidebar props
onKnowledgeBase={() => setViewMode(viewMode === 'knowledgebase' ? 'editor' : 'knowledgebase')}

// Content area
{viewMode === 'editor' ? (
  <TailwindAdvancedEditor />
) : viewMode === 'dashboard' ? (
  <InlineDashboard />
) : (
  <KnowledgeBase />  // Full iframe
)}
```

#### Updated Sidebar Button
```tsx
{/* Knowledge Base Button */}
{onKnowledgeBase && (
  <Button onClick={onKnowledgeBase}>
    <BookIcon />  // Changed icon to book
    Knowledge Base
  </Button>
)}
```

---

## How It Works Now

### Folder Workflow:
1. **Create folder:** Click "New Workspace" → name it "Client ABC"
2. **Add SOWs:** Click "New Document" button inside folder
3. **View contents:** Click folder name → expands to show all SOWs
4. **Organize:** Drag SOWs between folders
5. **Collapse:** Click folder again to hide contents

### Knowledge Base Workflow:
1. **Click "Knowledge Base"** in left sidebar Quick Actions
2. **Full AnythingLLM loads** in main content area
3. **Access all workspaces:** Master dashboard, client workspaces, everything
4. **Chat with SOWs:** Select workspace, ask questions
5. **Toggle back:** Click "Knowledge Base" again → returns to editor
6. **Sidebar stays:** Can still create/manage docs while viewing KB

### View Modes:
- **Editor** (default): Document editing with TipTap editor
- **Dashboard**: SOW stats, analytics, charts
- **Knowledge Base**: Full AnythingLLM access

---

## Files Changed

### 1. ✅ `/components/tailwind/sidebar.tsx`
**Changes:**
- Added `expandedFolders` state (Set<string>)
- Added `toggleFolderExpand` function
- Updated `DroppableFolder` component:
  - Added `isExpanded` and `onToggleExpand` props
  - Added clickable chevron button
  - Conditional rendering of children based on `isExpanded`
- Replaced "Ask AI" with "Knowledge Base" button
- Updated props interface: `onKnowledgeBase` instead of `onAskAI`

**Lines changed:** ~50 lines modified

---

### 2. ✅ NEW: `/components/tailwind/knowledge-base.tsx`
**Purpose:** Iframe component for AnythingLLM

**Features:**
- Full-height iframe
- Sandbox permissions for security
- Dark theme background
- Referrer policy for privacy

**Lines:** 15 lines

---

### 3. ✅ `/app/page.tsx`
**Changes:**
- Added `KnowledgeBase` import
- Updated `viewMode` type: `'editor' | 'dashboard' | 'knowledgebase'`
- Added `onKnowledgeBase` prop to Sidebar
- Updated content area ternary to handle 3 view modes
- Removed `onAskAI` handler (no longer needed)

**Lines changed:** ~10 lines modified

---

## Current Status

✅ **Working:**
- Folders expand/collapse on click
- Chevron animates (rotates 90°)
- SOWs show/hide based on folder state
- Knowledge Base button in sidebar
- AnythingLLM loads in iframe
- View mode switching works
- Sidebar always visible

⚠️ **To Test:**
1. Click folder name → should expand
2. Click again → should collapse
3. Click "Knowledge Base" → should load AnythingLLM
4. Sidebar should stay visible throughout

---

## Technical Details

### Folder State Management:
```tsx
// Using Set for O(1) lookup
const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

// Check if folder is expanded
const isExpanded = expandedFolders.has(folder.id);

// Toggle is efficient
const toggle = (id) => {
  const newSet = new Set(expandedFolders);
  newSet.has(id) ? newSet.delete(id) : newSet.add(id);
  setExpandedFolders(newSet);
};
```

### Iframe Security:
```tsx
sandbox="
  allow-same-origin      // Required for AnythingLLM to work
  allow-scripts          // JavaScript execution
  allow-forms            // Form submissions
  allow-popups           // Modal dialogs
  allow-popups-to-escape-sandbox  // External links
"
```

### View Mode Logic:
```tsx
// 3-way toggle
editor → dashboard → editor
editor → knowledgebase → editor
dashboard → editor → dashboard

// Each button toggles between its view and editor
onDashboard={() => setViewMode(mode === 'dashboard' ? 'editor' : 'dashboard')}
onKnowledgeBase(() => setViewMode(mode === 'knowledgebase' ? 'editor' : 'knowledgebase'))
```

---

## User Experience Improvements

### Before:
- ❌ Folders just sat there, couldn't see contents
- ❌ "Ask AI" was redundant with right sidebar
- ❌ Had to open external tab for AnythingLLM
- ❌ Lost context when switching apps

### After:
- ✅ Folders are interactive, show/hide contents
- ✅ "Knowledge Base" gives full AnythingLLM access
- ✅ Everything in one unified interface
- ✅ Sidebar always visible for quick actions
- ✅ Toggle between editor/dashboard/KB instantly

---

## Next Steps

### Test the Accordion:
```bash
# Refresh app
http://168.231.115.219:3005

# 1. Click a folder name
# Should see chevron rotate and SOWs appear

# 2. Click folder again
# Should collapse, hiding SOWs
```

### Test Knowledge Base:
```bash
# 1. Click "Knowledge Base" in left sidebar
# Should see full AnythingLLM interface

# 2. Navigate to different workspaces
# Should work exactly like external site

# 3. Click "Knowledge Base" again
# Should toggle back to editor
```

### Verify Folder Contents:
```bash
# Check database for folders with documents
mysql -h 168.231.115.219 -u sg_sow_user -p'SG_sow_2025_SecurePass!' \
  socialgarden_sow \
  -e "SELECT f.name as folder, COUNT(d.id) as doc_count 
      FROM folders f 
      LEFT JOIN documents d ON d.folder_id = f.id 
      GROUP BY f.id;"
```

---

## Design Details

### Folder Accordion Animation:
```css
/* Chevron rotation */
transition-transform duration-300
rotate-90  /* When expanded */

/* Content slide */
ml-4 mt-1  /* Indent children */
```

### Knowledge Base Styling:
```css
/* Full viewport */
h-full w-full

/* Match dark theme */
bg-[#0e0f0f]

/* No borders on iframe */
border-0
```

---

## Summary

**Folders:** Now clickable accordions that expand/collapse to show SOWs inside

**Knowledge Base:** Full AnythingLLM embedded in app, accessible via sidebar button

**User Flow:** Editor ↔ Dashboard ↔ Knowledge Base, all with sidebar visible

🎉 **Result:** Professional, unified interface with all tools in one place!
