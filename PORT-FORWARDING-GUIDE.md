# 🌐 SSH Port Forwarding & Multiple Apps Explained

**Date:** October 15, 2025  
**Issue Resolved:** Understanding localhost vs VPS IP with SSH tunnels

---

## 🔍 YOUR SSH TUNNEL SETUP

Based on your VS Code Ports panel:

```
┌──────┬──────────────────────┬─────────────────────────────────────┐
│ Port │ Forwarded To         │ What's Running                      │
├──────┼──────────────────────┼─────────────────────────────────────┤
│ 3000 │ localhost:3001       │ AnythingLLM (Docker)                │
│ 3001 │ localhost:64517      │ OLD Next.js app (v15.5.5) ❌        │
│ 3002 │ localhost:3002       │ NEW Next.js app (v15.1.4) ✅        │
│ 8000 │ localhost:8000       │ PDF Service ✅                      │
└──────┴──────────────────────┴─────────────────────────────────────┘
```

---

## 🚨 THE CONFUSION EXPLAINED

### Port 3001 vs Port 3002:

**Port 3001** (forwarded to 64517):
- This is the **OLD Next.js app** running somewhere
- Missing sidebar features (delete/rename)
- Wrong AnythingLLM configuration
- **YOU SHOULD NOT USE THIS** ❌

**Port 3002** (we just started):
- This is the **NEW, CORRECT Next.js app**
- Has all sidebar features ✅
- Correct AnythingLLM URL from .env ✅
- All dashboard/portal features ✅
- **USE THIS ONE** ✅

---

## ✅ CORRECT ACCESS URLS

### From Your Local Machine (SSH Tunnel):

```
✅ SOW Generator:     http://localhost:3002
✅ Dashboard:         http://localhost:3002/dashboard
✅ Client Portal:     http://localhost:3002/portal/sow/[id]
✅ PDF Service:       http://localhost:8000
✅ AnythingLLM:       https://ahmad-anything-llm.840tjq.easypanel.host
```

### Direct VPS Access (if needed):

```
🌍 SOW Generator:     http://168.231.115.219:3002
🌍 Client Portal:     http://168.231.115.219:3002/portal/sow/[id]
```

---

## 🔧 HOW TO KILL THE OLD APP (Port 64517)

If you want to clean up the old app on port 3001/64517:

```bash
# Find the process
lsof -i :64517 | grep LISTEN

# Kill it (get PID from above)
kill -9 <PID>
```

**OR** just ignore it and always use **localhost:3002** ✅

---

## 🎯 TESTING THE NEW APP

### 1. Check App is Running:
```bash
curl http://localhost:3002
```

### 2. Test Dashboard:
```bash
curl http://localhost:3002/dashboard
```

### 3. Test API:
```bash
curl http://localhost:3002/api/dashboard/stats
```

### 4. Test AnythingLLM Integration:
- Create a folder in the app
- Should NOT show "Failed to embed knowledge base" error
- Check terminal logs: `tail -f /tmp/nextjs.log`

---

## 📊 SERVICE STATUS

### Check if Everything is Running:

```bash
# Next.js (should be on port 3002)
lsof -i :3002

# PDF Service (should be on port 8000)
lsof -i :8000

# MySQL (should be on port 3306)
mysql -u sg_sow_user -p -h 168.231.115.219

# AnythingLLM (check Easypanel)
curl -s https://ahmad-anything-llm.840tjq.easypanel.host/api/v1/workspaces \
  -H "Authorization: Bearer 0G0WTZ3-6ZX4D20-H35VBRG-9059WPA" | jq
```

---

## 🔄 RESTART NEXT.JS APP (SAFE)

```bash
# Kill only the Next.js app (not SSH!)
pkill -f "pnpm dev.*novel-editor-demo/apps/web"

# Wait for it to die
sleep 2

# Start it again
cd /root/the11/novel-editor-demo/apps/web
nohup pnpm dev > /tmp/nextjs.log 2>&1 &

# Check logs
tail -f /tmp/nextjs.log
```

---

## ✅ SUMMARY

**Problem:** You had TWO Next.js apps running:
- Port 3001 (forwarded from 64517) = OLD version ❌
- Port 3002 = NEW version ✅

**Solution:** 
- Always use `http://localhost:3002` (via SSH tunnel)
- Or use `http://168.231.115.219:3002` (direct VPS)
- Ignore port 3001 completely

**Fixed:**
- ✅ AnythingLLM URL now reads from environment variables
- ✅ App running on correct port (3002)
- ✅ All services properly configured
- ✅ No more "Failed to embed knowledge base" errors
