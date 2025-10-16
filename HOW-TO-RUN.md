# 🚀 Social Garden SOW Generator - Quick Start

## How to Run This Project

### Method 1: Simple Start Script (RECOMMENDED)
```bash
bash /root/the11/start-all.sh
```

### Method 2: Manual Start
```bash
cd /root/the11/novel-editor-demo/apps/web
pnpm dev
```
This will start on `0.0.0.0:3005` (accessible from anywhere)

## 🌐 Access the App

**Main URL (Click This!):** http://168.231.115.219:3005

The app runs on your VPS and binds to `0.0.0.0:3005`, making it accessible from any browser.

**No SSH tunnels needed!** Just click the URL above.

## 📊 Check Status

```bash
# Check if running
ps aux | grep "PORT=3005"

# View logs
tail -f /tmp/nextjs.log
```

## 🛑 Stop the App

```bash
# Find the process ID
ps aux | grep "PORT=3005" | grep -v grep

# Kill it (replace PID with actual number)
kill <PID>

# Or kill all node processes (be careful!)
killall node
```

## 🔧 Services

### Main App (Next.js)
- **Port:** 3005
- **Location:** `/root/the11/novel-editor-demo/apps/web`
- **Status:** ✅ Running
- **Database:** MySQL (168.231.115.219:3306)
- **AnythingLLM:** https://ahmad-anything-llm.840tjq.easypanel.host

### PDF Service (Optional)
- **Port:** 8000
- **Location:** `/root/the11/pdf-service`
- **Status:** ⚠️ Needs dependencies
- **To install:**
  ```bash
  cd /root/the11/pdf-service
  pip3 install fastapi uvicorn weasyprint jinja2 pydantic
  python3 main.py &
  ```

## 📁 Key Locations

- **App Code:** `/root/the11/novel-editor-demo/apps/web`
- **Database Schema:** `/root/the11/database-schema.sql`
- **PDF Service:** `/root/the11/pdf-service`
- **Logs:** `/tmp/nextjs.log`

## 🎯 Features

### Left Sidebar - 2 Sections

**ACTIONS** (Top, Dark Green):
- 🎯 Dashboard - Opens master SOW dashboard
- 💡 Ask AI - Opens AI chat for current SOW
- 🔗 Share - Generates & copies shareable link
- 📄 Export PDF - Downloads SOW as PDF
- 📊 Export Excel - Downloads pricing as Excel

**DOCUMENTS** (Bottom):
- All folders and SOWs
- Drag & drop to organize
- Rename/Delete always visible

### Right Sidebar - AI Chat
- Multiple AI agents
- Streaming responses
- Insert SOW directly to editor

## 🔥 Recent Changes

1. ✅ **AI Insert to Editor** - Click "📝 Insert to Editor" on AI responses to add content with interactive pricing tables
2. ✅ **Debug Logging** - Console shows which AI model/provider is being used
3. ✅ **Sidebar Redesigned** - All actions moved to left sidebar
4. ✅ **Share Simplified** - One click to copy link
5. ✅ **Database Persistence** - Folders saved to MySQL
6. ✅ **Roles Auto-populate** - AI-generated roles match dropdown
7. ✅ **PDF Header Fixed** - Removed duplicate "Social Garden" text

## 🤖 Using the AI Chat

1. Click the **AI** button (bottom right)
2. Select **"The Architect (SOW Generator)"** agent
3. Ask for a complete SOW, e.g.:
   - "Create a HubSpot implementation SOW for $50k budget"
   - "Generate an email nurture program SOW"
   - "Create a retainer agreement for monthly support"
4. Wait for the AI to generate a complete SOW with pricing table
5. Click **"📝 Insert to Editor"** button on the AI response
6. The SOW will be inserted with **interactive pricing tables** automatically!

**Important:** If the SOW looks incomplete, ask the AI to "regenerate a complete SOW with all phases and pricing table"

## ⚠️ Troubleshooting

### Port already in use
```bash
# Kill existing processes
lsof -ti:3005 | xargs kill -9
# Then restart
bash /root/the11/start-all.sh
```

### App not loading
```bash
# Check logs
tail -f /tmp/nextjs.log
# Look for compilation errors
```

### Database errors
```bash
# Test connection
mysql -h 168.231.115.219 -u sg_sow_user -p'SG_sow_2025_SecurePass!' socialgarden_sow -e "SHOW TABLES;"
```

### Changes not showing
```bash
# Hard restart
kill $(ps aux | grep "PORT=3005" | grep -v grep | awk '{print $2}')
bash /root/the11/start-all.sh
# Wait 15 seconds for compilation
# Hard refresh browser: Ctrl+Shift+R
```

## 🎉 That's It!

Your app should now be running at **http://168.231.115.219:3005**

Need help? Check the logs: `tail -f /tmp/nextjs.log`
