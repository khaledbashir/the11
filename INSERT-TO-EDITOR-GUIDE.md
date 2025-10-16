# 📝 Insert to Editor - How It Works

## ✅ THE INTERACTIVE PRICING TABLE IS BACK!

When you click "Insert to Editor" on an AI response, here's what happens:

### 1️⃣ **Content Cleaning**
- Strips `<think>` tags and other AI reasoning text
- Removes non-client-facing content

### 2️⃣ **Markdown to Novel JSON Conversion**
- Converts markdown headings → Novel headings
- Converts markdown lists → Novel bullet lists
- **Converts markdown pricing tables → INTERACTIVE PRICING TABLES!** 🎉

### 3️⃣ **Role Matching**
- Matches AI-generated role names to your ROLES dropdown
- Auto-fills rates from the rate card
- Allows fuzzy matching (e.g., "Account Manager" matches "Account Management - Account Manager")

### 4️⃣ **Document Update**
- Inserts content into the editor
- Auto-renames document based on client name
- Preserves all formatting

---

## 🎯 What You Get

### Interactive Pricing Table Features:
✅ **Editable dropdown** for each role (matches your rate card)
✅ **Editable hours** field
✅ **Auto-calculating rates** from selected roles
✅ **Auto-calculating totals** (hours × rate)
✅ **Discount field** (optional %)
✅ **Grand total** with GST notation
✅ **Add/remove rows** buttons
✅ **Professional formatting** with proper borders and styling

---

## 📋 Example Workflow

### Step 1: Ask the AI
```
"Create a HubSpot implementation SOW for $50k budget"
```

### Step 2: AI Generates SOW
The AI will create a complete SOW with:
- Overview
- Project phases
- Deliverables (as bullet lists)
- **Pricing table in markdown format:**
  ```markdown
  | Role | Hours | Rate (AUD) | Total (AUD) |
  |------|-------|------------|-------------|
  | Tech - Sr. Consultant - Campaign Strategy | 40 | $295 | $11,800 +GST |
  | Tech - Specialist - Campaign Orchestration | 60 | $180 | $10,800 +GST |
  ...
  ```

### Step 3: Click "Insert to Editor"
The markdown table above automatically transforms into:

**Interactive Pricing Table Component:**
- Dropdowns for each role (searchable!)
- Editable hours fields
- Auto-calculated totals
- Discount percentage option
- Professional styling

### Step 4: Edit & Customize
- Change roles using the dropdown
- Adjust hours as needed
- Add discount if applicable
- Add/remove rows
- **Everything recalculates automatically!**

---

## 🔍 Debugging

If the pricing table doesn't appear interactive:

1. **Check Console Logs:**
   ```
   📝 Inserting content to editor: ...
   🔄 Converting markdown to JSON...
   ✅ Content converted
   ```

2. **Verify Table Format:**
   The AI should generate tables with these columns:
   - `Role` or `Description`
   - `Hours`
   - `Rate` or `Rate (AUD)`
   - `Total` (optional)

3. **Check Role Names:**
   Roles should match (or be close to) entries in the ROLES list
   - ✅ "Tech - Sr. Consultant - Campaign Strategy"
   - ✅ "Account Management - Senior Account Manager"
   - ❌ Random text that doesn't match any role

---

## 🎨 What the Interactive Table Looks Like

```
┌─────────────────────────────────────────────────────────────────┐
│  Role (Dropdown) ▼       │  Hours  │  Rate    │  Total          │
├─────────────────────────────────────────────────────────────────┤
│  Tech - Sr. Consultant   │  40     │  $295    │  $11,800 +GST   │
│  [Search roles...]       │  [Edit] │  [Auto]  │  [Auto-calc]    │
├─────────────────────────────────────────────────────────────────┤
│  Tech - Specialist       │  60     │  $180    │  $10,800 +GST   │
├─────────────────────────────────────────────────────────────────┤
│  Account Management      │  10     │  $210    │  $2,100 +GST    │
├─────────────────────────────────────────────────────────────────┤
│  [+ Add Row] [× Remove]                                         │
├─────────────────────────────────────────────────────────────────┤
│  Discount: [__]%                     │  -$0                      │
├─────────────────────────────────────────────────────────────────┤
│  Grand Total:                        │  $24,700 +GST            │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Quick Tips

### For Best Results:
1. **Be specific** with the AI: "Create a SOW for HubSpot implementation including email templates and workflows"
2. **Specify budget** if you have one: "around $50k"
3. **Request complete SOW**: "Make sure to include all phases and a detailed pricing table"
4. **Check the AI response** before inserting - it should have a markdown table
5. **Click Insert to Editor** - the magic happens automatically!

### If SOW is Incomplete:
- Ask: "Regenerate the SOW with complete deliverables and pricing table"
- Or: "Add more details to the [specific section]"
- Or: "Make the pricing table more detailed with at least 6 roles"

---

## 🚀 It's Live!

All changes are deployed and running. The system:
- ✅ Detects pricing tables in markdown
- ✅ Converts them to interactive components
- ✅ Matches roles to your rate card
- ✅ Auto-calculates totals
- ✅ Supports discounts
- ✅ Professional client-ready formatting

**Just ask the AI for a SOW and click Insert to Editor!** 🎉
