# 🚨 CRITICAL: PORT FORWARDING & SERVICE SETUP

**Date:** October 15, 2025  
**Issue:** Confusion between localhost and VPS IP

---

## 🔍 THE SITUATION

### Your SSH Setup:
You're SSHing into the VPS with port forwarding, which means:

- **`localhost:3002`** on your local machine → forwards to VPS
- **`168.231.115.219:3002`** → direct VPS IP access

### The Problem:
There were TWO different Next.js apps accessible:
1. **`http://localhost:3002/`** - NEW version (with sidebar features) via SSH tunnel
2. **`http://168.231.115.219:3002/`** - OLD version (missing features) direct access

---

## ✅ WHAT'S FIXED

### 1. AnythingLLM URL Configuration
**File:** `/root/the11/novel-editor-demo/apps/web/lib/anythingllm.ts`

**BEFORE:** Hardcoded URL
```typescript
const ANYTHINGLLM_BASE_URL = 'https://ahmad-anything-llm.840tjq.easypanel.host';
```

**NOW:** Uses environment variables
```typescript
const ANYTHINGLLM_BASE_URL = process.env.ANYTHINGLLM_URL || 'https://ahmad-anything-llm.840tjq.easypanel.host';
const ANYTHINGLLM_API_KEY = process.env.ANYTHINGLLM_API_KEY || '0G0WTZ3-6ZX4D20-H35VBRG-9059WPA';
```

### 2. Environment Variables
**File:** `/root/the11/novel-editor-demo/apps/web/.env`

```properties
ANYTHINGLLM_URL=https://ahmad-anything-llm.840tjq.easypanel.host
ANYTHINGLLM_API_KEY=0G0WTZ3-6ZX4D20-H35VBRG-9059WPA
```

---

## 🎯 CORRECT SERVICE CONFIGURATION

### Running Services:
```
┌─────────────────────┬──────────┬────────────────────────────────────┐
│ Service             │ Port     │ Access URL                         │
├─────────────────────┼──────────┼────────────────────────────────────┤
│ SOW Generator       │ 3002     │ http://localhost:3002              │
│ PDF Service         │ 8000     │ http://localhost:8000              │
│ MySQL Database      │ 3306     │ localhost:3306                     │
│ AnythingLLM         │ 3000     │ https://ahmad-anything-llm...host  │
└─────────────────────┴──────────┴────────────────────────────────────┘
```

### Important Notes:
- **AnythingLLM** is on Easypanel (NOT localhost:3000)
- **SOW App** runs on VPS port 3002, accessible via your SSH tunnel
- **PDF Service** runs locally on VPS port 8000

---

## 🔧 RESTART COMMAND (SAFE)

To restart the SOW app WITHOUT breaking SSH:

```bash
cd /root/the11/novel-editor-demo/apps/web
pkill -f "pnpm dev" 2>/dev/null  # Only kills pnpm, not all node
sleep 2
pnpm dev
```

**DO NOT USE:**
- ❌ `pkill -9 node` - Kills SSH and everything
- ❌ `pkill -9 -f "next dev"` - Too aggressive

---

## 📊 TESTING

### Test Dashboard:
```bash
curl http://localhost:3002/dashboard
```

### Test API:
```bash
curl http://localhost:3002/api/dashboard/stats
```

### Test PDF Service:
```bash
curl http://localhost:8000/health
```

---

## ✅ ACCESS POINTS

**From your local machine (via SSH tunnel):**
- SOW App: http://localhost:3002
- Dashboard: http://localhost:3002/dashboard
- Client Portal: http://localhost:3002/portal/sow/[id]

**Direct VPS access (if needed):**
- http://168.231.115.219:3002

**AnythingLLM (Easypanel):**
- https://ahmad-anything-llm.840tjq.easypanel.host
