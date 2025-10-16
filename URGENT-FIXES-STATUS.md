# 🚨 URGENT FIXES - PDF & PRICING TABLE

**Status:** ✅ **PDF FIXED** | 🔍 **PRICING TABLE INVESTIGATING**

---

## ✅ PDF EXPORT - FIXED!

### **Problem:**
- PDF service was not running
- Wrong filename (`app.py` vs `main.py`)

### **Solution:**
```bash
# ✅ PDF service is NOW RUNNING
cd /root/the11/pdf-service
nohup python3 main.py > pdf_service.log 2>&1 &
```

### **Verify:**
```bash
curl http://localhost:8000/health
# ✅ Returns: {"status":"healthy","service":"Social Garden PDF Service"}
```

**PDF export should work now!** Try exporting a document.

---

## 🔍 PRICING TABLE - INVESTIGATING

### **Issue:**
User reports pricing table is not showing up when clicking "Insert to Editor" button.

### **Expected Behavior:**
When AI generates a SOW with a pricing table like this:
```markdown
| Role | Description | Hours | Rate | Total |
|------|-------------|-------|------|-------|
| Senior Developer | Backend | 40 | $150 | $6,000 |
| Designer | UI/UX | 20 | $120 | $2,400 |
```

Should show **interactive pricing table** with:
- ✅ Dropdown role selectors
- ✅ Editable hours/rates
- ✅ Live calculations
- ✅ Discount field
- ✅ Drag & drop rows

### **What's Currently Happening:**
Shows regular table instead of interactive pricing table.

### **Code Analysis:**

#### ✅ Extension is Loaded:
File: `/root/the11/novel-editor-demo/apps/web/components/tailwind/extensions.ts`
```typescript
import { EditablePricingTable } from "./extensions/editable-pricing-table";

export const defaultExtensions: any[] = [
  // ... other extensions
  EditablePricingTable,  // ✅ This is loaded!
];
```

#### ✅ Detection Logic Exists:
File: `/root/the11/novel-editor-demo/apps/web/app/page.tsx` (line 85-88)
```typescript
const isPricingTable = headerRow.some(h => h.toLowerCase().includes('role')) &&
                      headerRow.some(h => h.toLowerCase().includes('hours')) &&
                      headerRow.some(h => h.toLowerCase().includes('rate'));
```

#### ✅ Conversion Logic Exists:
File: `/root/the11/novel-editor-demo/apps/web/app/page.tsx` (line 90-143)
```typescript
if (isPricingTable) {
  // Convert to editablePricingTable
  return {
    type: 'editablePricingTable',
    attrs: {
      rows: pricingRows,
      discount: 0,
    },
  };
}
```

### **Possible Issues:**

1. **AI not generating correct format** - Need to check what AI is actually sending
2. **Column names mismatch** - AI might use different headers
3. **Editor not recognizing node type** - Extension not rendering

---

## 🧪 HOW TO TEST RIGHT NOW

### **Test 1: PDF Export**
```bash
1. Open: http://168.231.115.219:3005
2. Create/open any document
3. Add some content
4. Click Export PDF button (bottom right)
5. ✅ Should download PDF file
```

### **Test 2: Pricing Table**
```bash
1. Open: http://168.231.115.219:3005
2. Click AI Sidebar (chat icon)
3. Ask AI: "Generate a SOW with pricing table showing:
   - Senior Developer: 40 hours at $150/hr
   - Designer: 20 hours at $120/hr"
4. Wait for AI response
5. Click "Insert to Editor" button
6. **CHECK:** Is it showing interactive pricing table or regular table?
```

---

## 🔧 DEBUGGING STEPS

### **Step 1: Check Browser Console**
Open browser console (F12) and look for:
- `💰 Detected pricing table` - Should appear if detection works
- Any errors related to `editablePricingTable`

### **Step 2: Check AI Output**
When AI generates SOW, check if table has correct format:
- ✅ Has `Role` column
- ✅ Has `Hours` or `Hour` column  
- ✅ Has `Rate` or `$/hr` column

### **Step 3: Manual Test**
Try manually typing this in the editor:

```markdown
| Role | Hours | Rate |
|------|-------|------|
| Developer | 40 | 150 |
```

Then use AI to insert it.

---

## 🎯 QUICK FIX IF NEEDED

If pricing table still doesn't work, here's the nuclear option:

### **Option 1: Use Slash Command**
Type `/table` in editor to insert table, then manually convert to pricing table.

### **Option 2: Use Pricing Table Builder**
Add a button to manually open pricing table builder component.

### **Option 3: Force Conversion**
Update detection logic to be more lenient:

```typescript
// Current (strict):
const isPricingTable = headerRow.some(h => h.toLowerCase().includes('role')) &&
                      headerRow.some(h => h.toLowerCase().includes('hours')) &&
                      headerRow.some(h => h.toLowerCase().includes('rate'));

// New (lenient):
const isPricingTable = headerRow.some(h => 
  h.toLowerCase().includes('role') || 
  h.toLowerCase().includes('position') ||
  h.toLowerCase().includes('team member')
) && (
  headerRow.some(h => h.toLowerCase().includes('hours') || h.toLowerCase().includes('hour')) ||
  headerRow.some(h => h.toLowerCase().includes('rate') || h.toLowerCase().includes('cost'))
);
```

---

## ✅ WHAT'S WORKING

1. ✅ **PDF Export** - Service running on port 8000
2. ✅ **Database Persistence** - Documents/folders saved to MySQL
3. ✅ **Auto-save** - Documents save every 2 seconds
4. ✅ **Extension Loaded** - EditablePricingTable is in extensions array
5. ✅ **Detection Logic** - Code exists to detect pricing tables
6. ✅ **Conversion Logic** - Code exists to convert to interactive table

---

## 🐛 WHAT NEEDS INVESTIGATION

1. 🔍 **What is AI actually sending?** - Need to see exact markdown
2. 🔍 **Is detection triggering?** - Check console for log messages
3. 🔍 **Is extension rendering?** - Verify editablePricingTable node shows up

---

## 📞 NEXT STEPS

**User should:**
1. ✅ Test PDF export (should work now)
2. 🔍 Test pricing table and report what they see
3. 📸 Share screenshot of what's showing instead of pricing table
4. 🖥️ Share browser console logs (F12 → Console tab)

**Then we can:**
- See exact markdown AI is generating
- Verify if detection is triggering
- Fix any rendering issues

---

**PDF IS FIXED! Let's debug the pricing table together.** 🚀
