# 🎩 Social Garden - Custom Slash Commands (Presets)

**Philosophy**: One command = Complete workflow. Zero technical jargon.

---

## 📊 ANALYTICS COMMANDS

### `/analytics`
**Command**: `@agent`
**Prompt**: 
```
You are a business intelligence analyst. I'll ask you questions about our SOW database (socialgarden_sow). 

Use the SQL agent to query:
- documents table (SOWs)
- folders table (clients)
- agents table (AI agents)
- chat_messages table (conversations)
- sow_acceptances, sow_rejections (status)

Format results elegantly with:
- Clear numbers
- Percentage changes
- Visual indicators (📈📉)
- Professional insights

Database: socialgarden_sow
Mode: READ-ONLY analytics
```

**Description**: "Business intelligence - ask about SOWs, clients, revenue, trends"

---

### `/insights`
**Command**: `@agent`
**Prompt**:
```
Analyze our SOW database (socialgarden_sow) and provide strategic insights.

Focus on:
1. Revenue trends (weekly, monthly, quarterly)
2. Client engagement patterns
3. Conversion rates (sent → accepted)
4. Average SOW values by service type
5. Top performing offerings
6. Growth opportunities

Use SQL queries to support your insights.
Format as executive summary with key metrics and recommendations.

Database: socialgarden_sow
```

**Description**: "Executive insights - trends, opportunities, recommendations"

---

### `/pipeline`
**Command**: `@agent`
**Prompt**:
```
Show me our sales pipeline from socialgarden_sow database.

Calculate:
- Total pending SOWs (status = 'sent')
- Total accepted SOWs (status = 'accepted')  
- Pipeline value (pending total_investment)
- Closed value (accepted total_investment)
- Conversion rate
- Average time to acceptance

Format as professional pipeline report with stage breakdown.

Database: socialgarden_sow
```

**Description**: "Sales pipeline - pending, accepted, conversion rates"

---

## 📝 SOW GENERATION COMMANDS

### `/sow`
**Command**: Direct to gen workspace
**Prompt**:
```
You are The Architect, Social Garden's elite SOW generator.

Use the rate card, templates, and rules from this workspace to create a comprehensive Scope of Work.

Requirements:
1. Follow budget constraints exactly
2. Include mandatory roles (Senior PM, Project Coordinator, Account Manager)
3. Use granular role allocation
4. Create bespoke deliverables
5. Include proper assumptions section
6. Add interactive pricing table
7. Professional markdown formatting

End with: "*** This concludes the Scope of Work document. ***"

I'll provide: Client name, project type, deliverables, budget
```

**Description**: "Generate SOW - comprehensive scope with pricing table"

---

### `/quote`
**Command**: Direct to gen workspace
**Prompt**:
```
Create a quick pricing quote (simplified SOW).

Focus on:
- High-level deliverables
- Major milestones
- Total investment breakdown
- Timeline estimate
- Next steps

Use rate card for accurate pricing but keep format concise.
Perfect for initial client discussions.
```

**Description**: "Quick quote - simplified pricing for initial discussions"

---

### `/template`
**Command**: Direct to gen workspace
**Prompt**:
```
Show me available SOW templates and help me select the right one.

Templates available:
- HubSpot Implementation
- Email Campaign Build
- Landing Page Development
- Marketing Automation Audit
- Custom Development Project
- Branding & Design Package

After selection, I'll customize it with client-specific details.
```

**Description**: "SOW templates - start from proven structures"

---

## 💬 CLIENT PORTAL COMMANDS

### `/client`
**Command**: Switch to client workspace
**Prompt**:
```
You are a client success assistant for [CLIENT_NAME].

You have access to:
- Their SOWs and project history
- Deliverable timelines
- Payment schedules
- Past communications

Answer questions professionally about:
- Project status
- Timeline clarifications
- Scope details
- Next steps
- Invoice breakdowns

Be friendly, clear, and solution-oriented.
```

**Description**: "Client assistant - answer questions about their projects"

---

### `/onboard`
**Command**: Client workspace setup
**Prompt**:
```
Create a complete onboarding package for [CLIENT_NAME].

Generate:
1. Welcome message with key contacts
2. Project timeline overview
3. Communication guidelines
4. Next steps checklist
5. FAQ section specific to their project

Format professionally with Social Garden branding.
```

**Description**: "Client onboarding - welcome package and guidelines"

---

## 🔍 SEARCH & DISCOVERY COMMANDS

### `/find`
**Command**: `@agent`
**Prompt**:
```
Search the socialgarden_sow database for SOWs matching specific criteria.

I can search by:
- Client name
- Service type (HubSpot, email, landing pages, etc.)
- Budget range
- Date created
- Status (draft, sent, accepted, rejected)
- Folder/category

Use SQL queries with LIKE, WHERE, AND conditions.
Return results as formatted list with key details.

Database: socialgarden_sow
```

**Description**: "Search SOWs - find by client, service, budget, date"

---

### `/similar`
**Command**: `@agent`
**Prompt**:
```
Find SOWs similar to [REFERENCE_SOW_ID] in socialgarden_sow.

Match on:
- Similar total_investment (±20%)
- Same service category
- Similar deliverables (text search in content)
- Same client industry

Show results with comparison table and highlight similarities.

Database: socialgarden_sow
```

**Description**: "Find similar SOWs - great for benchmarking"

---

## 📈 REPORTING COMMANDS

### `/report`
**Command**: `@agent`
**Prompt**:
```
Generate a comprehensive business report from socialgarden_sow.

Include:
1. Executive Summary
   - Total SOWs created
   - Total revenue (accepted)
   - Pipeline value (pending)
   - Key metrics

2. Detailed Analysis
   - Monthly trends
   - Top clients by revenue
   - Service mix breakdown
   - Conversion funnel

3. Strategic Recommendations
   - Growth opportunities
   - Resource optimization
   - Pricing insights

Format as professional markdown report with tables and charts data.

Database: socialgarden_sow
Time period: [specify or default to last 90 days]
```

**Description**: "Business report - comprehensive analytics and insights"

---

### `/monthly`
**Command**: `@agent`
**Prompt**:
```
Create monthly performance report for [MONTH/YEAR] from socialgarden_sow.

Metrics:
- SOWs created vs previous month
- Revenue closed vs previous month
- Win rate (accepted/sent)
- Average SOW value
- Top 5 clients
- Service category breakdown
- Pipeline health

Format with month-over-month comparisons and percentage changes.

Database: socialgarden_sow
```

**Description**: "Monthly report - performance vs previous month"

---

## 🛠️ UTILITY COMMANDS

### `/status`
**Command**: `@agent`
**Prompt**:
```
Check status of SOW [SOW_ID] in socialgarden_sow.

Show:
- Current status (draft/sent/accepted/rejected)
- Created date
- Last updated
- Client activity (views, comments, questions)
- Payment status
- Next action required

Format as status dashboard with timestamps.

Database: socialgarden_sow
```

**Description**: "SOW status - check progress and activity"

---

### `/backup`
**Command**: System command
**Prompt**:
```
Create backup of key data:
1. Export all SOWs to JSON
2. Export rate card
3. Export client list
4. Export analytics snapshot

Save to /backups/[YYYY-MM-DD]/

Show backup summary with file sizes and record counts.
```

**Description**: "Backup data - export SOWs and configurations"

---

### `/health`
**Command**: `@agent`
**Prompt**:
```
Run system health check on socialgarden_sow database.

Check:
- Database connectivity
- Table record counts
- Orphaned records (foreign key issues)
- Data integrity (NULL values, invalid statuses)
- Recent activity (last 24 hours)
- Storage usage

Format as health dashboard with ✅/⚠️/❌ indicators.

Database: socialgarden_sow
```

**Description**: "System health - check database and data integrity"

---

## 🎨 DESIGN & FORMATTING COMMANDS

### `/polish`
**Command**: Direct chat
**Prompt**:
```
Review and polish this SOW for professional presentation.

Improvements:
1. Grammar and spelling
2. Professional tone
3. Consistent formatting
4. Clear section headers
5. Proper markdown syntax
6. Table alignment
7. Bullet point consistency

Return polished version ready for client.
```

**Description**: "Polish SOW - improve formatting and presentation"

---

### `/summarize`
**Command**: Direct chat
**Prompt**:
```
Create executive summary of this SOW.

Include:
- Project overview (2-3 sentences)
- Key deliverables (bullet points)
- Total investment
- Timeline estimate
- Team composition

Keep under 200 words, perfect for email or quick reference.
```

**Description**: "Executive summary - concise SOW overview"

---

## 🎯 WORKFLOW COMBINATIONS

### Common Workflows:

#### **Create New SOW:**
```
1. /sow → Generate comprehensive SOW
2. /polish → Clean up formatting  
3. /client → Switch to client workspace
4. Share SOW link
```

#### **Monthly Review:**
```
1. /monthly → Get month performance
2. /pipeline → Check current pipeline
3. /insights → Strategic recommendations
4. /report → Full business report
```

#### **Client Question:**
```
1. /client → Enter client mode
2. Answer their questions
3. /status → Check SOW progress
4. /exit → Return to normal
```

#### **Data Analysis:**
```
1. /analytics → Enter analytics mode
2. Ask multiple questions
3. /report → Generate report
4. /exit → Return to normal
```

---

## 🎩 IMPLEMENTATION IN UI

### Slash Command Dropdown:
```tsx
<SlashCommandMenu>
  <Category name="📊 Analytics">
    <Command>/analytics</Command>
    <Command>/insights</Command>
    <Command>/pipeline</Command>
    <Command>/report</Command>
  </Category>
  
  <Category name="📝 SOW Creation">
    <Command>/sow</Command>
    <Command>/quote</Command>
    <Command>/template</Command>
  </Category>
  
  <Category name="💬 Client Support">
    <Command>/client</Command>
    <Command>/onboard</Command>
  </Category>
  
  <Category name="🔍 Search">
    <Command>/find</Command>
    <Command>/similar</Command>
  </Category>
  
  <Category name="🛠️ Utilities">
    <Command>/status</Command>
    <Command>/health</Command>
    <Command>/polish</Command>
  </Category>
</SlashCommandMenu>
```

---

## ✨ BENEFITS

1. **Zero Technical Jargon** - No `@agent`, no database names visible
2. **One Command = Complete Workflow** - Everything preset
3. **Context-Aware** - Remembers you're in agent mode
4. **Professional** - Clean, sophisticated UX
5. **Discoverable** - Type `/` to see all options
6. **Efficient** - Common tasks = one command

---

*"Sophistication is making complexity invisible."* 🎩
