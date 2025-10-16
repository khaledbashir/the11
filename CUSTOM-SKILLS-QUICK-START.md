# 🎯 Custom Skills Quick Start Guide

## TL;DR - You Asked, I Answered

**Your Question**: "maybe u could also use the custom skills somewhere for somethig idk"

**My Answer**: HELL YES! Use custom skills for:
1. ⭐⭐⭐⭐⭐ Rate Card Lookup (fetch accurate rates)
2. ⭐⭐⭐⭐⭐ SOW Generator (auto-create complete SOWs)
3. ⭐⭐⭐⭐ Client Data Fetcher (get client history)

---

## 🚀 Simplest Path to Get Started

### Step 1: SSH into Your VPS (5 minutes)
```bash
ssh root@168.231.115.219

# Find AnythingLLM container
docker ps | grep anythingllm

# Find storage volume
docker inspect <container_id> | grep -A5 Mounts

# Navigate to plugins directory
cd /var/lib/docker/volumes/<volume_name>/_data/plugins
mkdir -p agent-skills
cd agent-skills
```

### Step 2: Create Your First Skill - Rate Card Lookup (10 minutes)

```bash
# Create directory
mkdir rate-card-lookup
cd rate-card-lookup

# Create plugin.json
cat > plugin.json << 'EOF'
{
  "name": "Rate Card Lookup",
  "hubId": "rate-card-lookup",
  "version": "1.0.0",
  "description": "Fetches accurate hourly rates for roles from Social Garden rate card",
  "entrypoint": {
    "roleName": {
      "type": "string",
      "required": true,
      "description": "Name of the role to look up"
    }
  },
  "setup_args": {
    "DATABASE_URL": {
      "type": "string",
      "required": true,
      "input": {
        "type": "text",
        "placeholder": "MySQL connection string"
      }
    }
  }
}
EOF

# Create handler.js
cat > handler.js << 'EOF'
const mysql = require('mysql2/promise');

module.exports.runtime = {
  handler: async function ({ roleName }) {
    this.introspect(`🔍 Looking up rate for: ${roleName}`);
    
    try {
      const db = await mysql.createConnection(this.config.DATABASE_URL);
      
      let [rows] = await db.query(
        'SELECT * FROM rate_card WHERE role_name LIKE ?',
        [`%${roleName}%`]
      );
      
      await db.end();
      
      if (rows.length === 0) {
        return `No rate found for role: ${roleName}`;
      }
      
      const role = rows[0];
      this.introspect(`✅ Found: ${role.role_name} - $${role.hourly_rate}/hr`);
      
      return JSON.stringify({
        roleName: role.role_name,
        hourlyRate: role.hourly_rate,
        category: role.category
      }, null, 2);
      
    } catch (error) {
      return `Error: ${error.message}`;
    }
  }
};
EOF

# Install dependency
npm install mysql2
```

### Step 3: Restart AnythingLLM (2 minutes)
```bash
# Go back to root
cd ~

# Restart container
docker restart <container_id>

# Watch logs
docker logs -f <container_id>
# Look for: "Loaded custom agent skill: rate-card-lookup"
```

### Step 4: Configure in UI (3 minutes)
1. Open https://ahmad-anything-llm.840tjq.easypanel.host
2. Go to **Settings → Agent Skills**
3. Find "Rate Card Lookup"
4. Click **Configure**
5. Set DATABASE_URL:
   ```
   mysql://sg_sow_user:SG_sow_2025_SecurePass!@168.231.115.219:3306/socialgarden_sow
   ```
6. Click **Save**

### Step 5: Test It! (2 minutes)
1. Open any workspace (use "gen")
2. Enable **Agent Mode** (toggle at top)
3. Type: `@agent What's the rate for a Senior Developer?`
4. Agent should invoke skill and return rate!

---

## 📊 Expected Results

### What You'll See:

**User asks**: "What's the hourly rate for Content Writer?"

**Agent thinks**:
```
🔍 Looking up rate for: Content Writer
✅ Found: Content Writer - Senior - $85/hr
```

**Agent responds**:
```json
{
  "roleName": "Content Writer - Senior",
  "hourlyRate": 85,
  "category": "Content Creation"
}
```

---

## 🎯 Next Skills to Add

### Skill #2: Client Data Fetcher (15 minutes)
See `/CUSTOM-SKILLS-BLUEPRINT.md` - lines 400-500

### Skill #3: SOW Generator (30 minutes)
See `/CUSTOM-SKILLS-BLUEPRINT.md` - lines 200-350

---

## 🐛 Troubleshooting

### "Skill not showing in UI"
- Check folder name matches `hubId` in plugin.json
- Restart container: `docker restart <container_id>`
- Check logs: `docker logs <container_id>`

### "Database connection failed"
- Verify DATABASE_URL is correct
- Test connection from container:
  ```bash
  docker exec -it <container_id> sh
  mysql -h 168.231.115.219 -u sg_sow_user -p socialgarden_sow
  ```

### "Skill not being invoked"
- Make sure Agent Mode is enabled in workspace
- Use `@agent` prefix in your message
- Check if skill name appears in agent's available tools

---

## 📚 Full Documentation

See `/CUSTOM-SKILLS-BLUEPRINT.md` for:
- Complete skill examples
- Decision matrix
- Architecture diagrams
- Advanced implementations
- Best practices

---

## 💡 Pro Tips

1. **Start Simple**: Rate Card Lookup first
2. **Test Each Step**: Don't rush to production
3. **Use Introspection**: `this.introspect()` shows progress to user
4. **Error Handling**: Always wrap in try/catch
5. **Document**: Add README.md to each skill folder

---

## 🎉 Why This is AWESOME

**Before Custom Skills**:
- Manual rate lookups → slow, error-prone
- Copy-paste templates → inconsistent
- No automation → everything manual

**After Custom Skills**:
- Ask AI "What's the rate for X?" → instant accurate answer
- Ask AI "Generate SOW for Acme Corp" → complete SOW in seconds
- Ask AI "Show client history" → full context immediately

**You just turned your SOW system into an AI-POWERED MACHINE.** 🚀

---

## 🎯 Bottom Line

**Yes, use custom skills.**
**Start with Rate Card Lookup.**
**Follow the 5 steps above.**
**You'll be done in 20 minutes.**

Then come back and tell me it worked so we can add the next skill! 😎

---

**Status**: Blueprint ready, waiting for your deployment
**Difficulty**: Easy (I wrote all the code for you)
**Time**: 20 minutes
**Value**: IMMENSE 🔥
