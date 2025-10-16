# 🐛 CRITICAL BUGS FIX - SOW Persistence & Folder UX

**Date:** October 16, 2025  
**Priority:** 🔴 CRITICAL

---

## 🐛 Bug 1: SOWs Disappearing

### Problem:
SOWs are being saved to `localStorage` instead of the database, causing them to:
- Disappear on browser clear
- Not sync across devices
- Not persist reliably

### Root Cause:
```typescript
// page.tsx line 388
useEffect(() => {
  localStorage.setItem("documents", JSON.stringify(documents));
}, [documents]);
```

Documents are only saved to localStorage, not to database!

### Fix Required:
Save documents to database via API, not localStorage.

---

## 🐛 Bug 2: Folders Hard to Click

### Problem:
- Small clickable area (only chevron icon)
- No visual feedback on hover
- Confusing UX - users don't know where to click

### Root Cause:
```typescript
// sidebar.tsx line 222
<button onClick={() => onToggleExpand(folder.id)} className="p-0">
  <ChevronRight className={`h-3 w-3`} />
  <Folder className="h-4 w-4" />
</button>
```

Only the tiny button is clickable, not the entire folder row.

### Fix Required:
Make entire folder row clickable with clear hover states.

---

## 🐛 Bug 3: Extension Context Errors

### Problem:
```
content.js:10 Uncaught Error: Extension context invalidated.
```

Browser extension interfering with the app.

### Fix:
Not a code issue - user needs to disable browser extension.

---

## 🎯 IMPLEMENTATION PLAN

### Phase 1: Fix SOW Persistence (HIGH PRIORITY) 🔴

#### Step 1: Create Documents API
**File:** `/app/api/documents/route.ts` (NEW)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

// GET all documents
export async function GET() {
  try {
    const result = await sql`
      SELECT * FROM documents 
      ORDER BY created_at DESC
    `;
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

// POST new document
export async function POST(request: NextRequest) {
  try {
    const { id, title, content, folderId } = await request.json();
    
    const result = await sql`
      INSERT INTO documents (id, title, content, folder_id, created_at, updated_at)
      VALUES (${id}, ${title}, ${content}, ${folderId}, NOW(), NOW())
      RETURNING *
    `;
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 });
  }
}
```

#### Step 2: Create Document Update API
**File:** `/app/api/documents/[id]/route.ts` (NEW)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

// GET single document
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await sql`
      SELECT * FROM documents WHERE id = ${params.id}
    `;
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json({ error: 'Failed to fetch document' }, { status: 500 });
  }
}

// PUT update document
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { title, content, folderId } = await request.json();
    
    const result = await sql`
      UPDATE documents 
      SET 
        title = ${title},
        content = ${content},
        folder_id = ${folderId},
        updated_at = NOW()
      WHERE id = ${params.id}
      RETURNING *
    `;
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
  }
}

// DELETE document
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await sql`DELETE FROM documents WHERE id = ${params.id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}
```

#### Step 3: Create Database Migration
**File:** `database-schema.sql` (UPDATE)

```sql
-- Add documents table if not exists
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content JSONB,
  folder_id TEXT,
  workspace_slug TEXT,
  thread_slug TEXT,
  share_metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_documents_folder ON documents(folder_id);
CREATE INDEX IF NOT EXISTS idx_documents_workspace ON documents(workspace_slug);
```

#### Step 4: Update page.tsx to use database
**File:** `app/page.tsx` (UPDATE)

Find this:
```typescript
useEffect(() => {
  localStorage.setItem("documents", JSON.stringify(documents));
}, [documents]);
```

Replace with:
```typescript
// Auto-save document to database when it changes
useEffect(() => {
  if (!currentDocId) return;
  
  const currentDoc = documents.find(d => d.id === currentDocId);
  if (!currentDoc) return;
  
  const saveTimeout = setTimeout(async () => {
    try {
      await fetch(`/api/documents/${currentDocId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: currentDoc.title,
          content: currentDoc.content,
          folderId: currentDoc.folderId,
        }),
      });
      console.log('✅ Document auto-saved to database');
    } catch (error) {
      console.error('❌ Failed to auto-save document:', error);
    }
  }, 2000); // Save 2 seconds after last change
  
  return () => clearTimeout(saveTimeout);
}, [documents, currentDocId]);
```

#### Step 5: Load documents from database on mount
**File:** `app/page.tsx` (UPDATE)

Find this:
```typescript
const loadData = async () => {
  console.log('📂 Starting to load folders from database...');
  const savedDocs = localStorage.getItem("documents");
  const savedCurrent = localStorage.getItem("currentDocId");
  
  // Load documents from localStorage
  if (savedDocs) {
    setDocuments(JSON.parse(savedDocs));
  }
```

Replace with:
```typescript
const loadData = async () => {
  console.log('📂 Starting to load folders and documents from database...');
  
  // Load documents from DATABASE
  try {
    const response = await fetch('/api/documents');
    if (response.ok) {
      const dbDocs = await response.json();
      console.log('✅ Loaded documents from database:', dbDocs.length);
      
      if (dbDocs.length > 0) {
        setDocuments(dbDocs);
        setCurrentDocId(dbDocs[0].id); // Select first document
      } else {
        // Create initial document
        const initialDoc = {
          id: "doc1",
          title: "Untitled Document",
          content: defaultEditorContent,
        };
        setDocuments([initialDoc]);
        setCurrentDocId("doc1");
      }
    }
  } catch (error) {
    console.error('❌ Error loading documents:', error);
  }
```

---

### Phase 2: Fix Folder Clickability (MEDIUM PRIORITY) ⚠️

#### Update sidebar.tsx - Make entire folder row clickable

**File:** `components/tailwind/sidebar.tsx` (UPDATE)

Find the `DroppableFolder` component around line 215:

Replace this:
```typescript
<div className="flex items-center gap-2 px-3 py-2 hover:bg-[#1b1b1e] rounded-md group">
  <button onClick={() => onToggleExpand(folder.id)} className="p-0">
    <ChevronRight className={`h-3 w-3`} />
    <Folder className="h-4 w-4" />
  </button>
  {/* rest of folder content */}
</div>
```

With this:
```typescript
<div 
  className={`
    flex items-center gap-2 px-3 py-2.5 
    hover:bg-[#0e2e33]/50 
    rounded-md 
    group 
    cursor-pointer
    transition-all duration-150
    ${isExpanded ? 'bg-[#0e2e33]/30' : ''}
  `}
  onClick={() => onToggleExpand(folder.id)}
>
  <ChevronRight 
    className={`
      h-4 w-4 text-gray-400 
      transition-transform duration-200
      ${isExpanded ? 'rotate-90' : ''}
    `}
  />
  <Folder className={`
    h-4 w-4 
    ${isExpanded ? 'text-[#20e28f]' : 'text-gray-400'}
    transition-colors duration-200
  `} />
  
  {renamingId === folder.id ? (
    <Input
      value={renameValue}
      onChange={(e) => setRenameValue(e.target.value)}
      onBlur={() => onRename(folder.id)}
      onKeyDown={(e) => e.key === 'Enter' && onRename(folder.id)}
      onClick={(e) => e.stopPropagation()}
      className="h-7 py-0 text-sm bg-[#1b1b1e] border-[#0e2e33] text-white"
      autoFocus
    />
  ) : (
    <span className={`
      text-sm font-medium flex-1 truncate 
      ${isExpanded ? 'text-white' : 'text-gray-300'}
      group-hover:text-white
      transition-colors duration-150
    `}>
      {folder.name}
    </span>
  )}
  
  {/* Action buttons */}
  <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
    <Button
      size="sm"
      variant="ghost"
      className="h-7 w-7 p-0 hover:bg-[#1b5e5e]/20 text-[#1b5e5e] hover:text-[#1b5e5e]"
      onClick={(e) => {
        e.stopPropagation();
        onNewDoc(folder.id);
      }}
      title="New SOW in this workspace"
    >
      <Plus className="h-4 w-4" />
    </Button>
    <Button
      size="sm"
      variant="ghost"
      className="h-7 w-7 p-0 hover:bg-[#0e2e33] text-gray-400 hover:text-white"
      onClick={(e) => {
        e.stopPropagation();
        setRenamingId(folder.id);
        setRenameValue(folder.name);
      }}
      title="Rename workspace"
    >
      <Edit3 className="h-3.5 w-3.5" />
    </Button>
    <Button
      size="sm"
      variant="ghost"
      className="h-7 w-7 p-0 hover:bg-[#0e2e33] text-red-400 hover:text-red-500"
      onClick={(e) => {
        e.stopPropagation();
        onDelete(folder.id);
      }}
      title="Delete workspace"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </Button>
  </div>
</div>
```

---

### Phase 3: Add Visual Feedback (LOW PRIORITY) ℹ️

#### Add loading states and success notifications

**File:** `app/page.tsx` (UPDATE)

Add these states:
```typescript
const [isSaving, setIsSaving] = useState(false);
const [lastSaved, setLastSaved] = useState<Date | null>(null);
```

Update auto-save:
```typescript
useEffect(() => {
  if (!currentDocId) return;
  
  const currentDoc = documents.find(d => d.id === currentDocId);
  if (!currentDoc) return;
  
  setIsSaving(true);
  
  const saveTimeout = setTimeout(async () => {
    try {
      await fetch(`/api/documents/${currentDocId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: currentDoc.title,
          content: currentDoc.content,
          folderId: currentDoc.folderId,
        }),
      });
      setLastSaved(new Date());
      console.log('✅ Document auto-saved to database');
    } catch (error) {
      console.error('❌ Failed to auto-save document:', error);
      toast.error('Failed to save document');
    } finally {
      setIsSaving(false);
    }
  }, 2000);
  
  return () => clearTimeout(saveTimeout);
}, [documents, currentDocId]);
```

Add save indicator to UI:
```tsx
<div className="flex items-center gap-2 text-xs text-gray-400">
  {isSaving ? (
    <>
      <Loader2 className="h-3 w-3 animate-spin" />
      Saving...
    </>
  ) : lastSaved ? (
    <>
      <Check className="h-3 w-3 text-green-500" />
      Saved {lastSaved.toLocaleTimeString()}
    </>
  ) : null}
</div>
```

---

## 🔧 QUICK FIX (Temporary)

If you need documents to persist RIGHT NOW without database changes:

### Use sessionStorage instead of localStorage

**File:** `app/page.tsx`

Replace all `localStorage` with `sessionStorage`:

```typescript
// Before
localStorage.setItem("documents", JSON.stringify(documents));

// After  
sessionStorage.setItem("documents", JSON.stringify(documents));
```

This will at least keep documents during the session.

---

## 🎯 PRIORITY ORDER

1. **🔴 CRITICAL:** Fix folder clickability (30 min) - Users can't use the app
2. **🔴 CRITICAL:** Add database persistence (2 hours) - Data is being lost
3. **⚠️ MEDIUM:** Add visual feedback (30 min) - Better UX
4. **ℹ️ LOW:** Browser extension fix (user-side) - Not our code

---

## 📋 TESTING CHECKLIST

### Test SOW Persistence:
- [ ] Create a new SOW
- [ ] Edit content
- [ ] Wait 2 seconds (auto-save)
- [ ] Check console for "✅ Document auto-saved"
- [ ] Refresh page
- [ ] Verify SOW still exists with correct content

### Test Folder Clickability:
- [ ] Click anywhere on folder row - should expand/collapse
- [ ] Hover over folder - should show hover state
- [ ] Click action buttons - should work without toggling folder
- [ ] Verify visual feedback is clear

### Test Database Queries:
- [ ] Check `/api/documents` returns all documents
- [ ] Check `/api/documents/[id]` returns specific document
- [ ] Test document creation
- [ ] Test document update
- [ ] Test document deletion

---

## 🚀 DEPLOYMENT

1. Run database migration:
```bash
psql $DATABASE_URL -f database-schema.sql
```

2. Test locally:
```bash
pnpm dev
```

3. Deploy:
```bash
git add .
git commit -m "fix: Add database persistence for SOWs and improve folder UX"
git push origin production-ready
```

---

**Status:** Ready to implement  
**Estimated time:** 3 hours total  
**Risk:** Low (database changes are additive)
