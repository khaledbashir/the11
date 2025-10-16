# Visual SOW Dashboard - Implementation Plan

## 🎯 Overview
A clean, professional dashboard that shows SOW analytics BEFORE creating a new SOW. Uses the AnythingLLM master dashboard workspace to fetch real data.

---

## 📊 Dashboard Layout

### Top Stats Bar (4 cards)
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Total SOWs  │ Total Value │ Active      │ This Month  │
│    127      │  $2.4M AUD  │    23       │    12       │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### Main Content (3 columns)
```
┌───────────────────┬───────────────────┬───────────────────┐
│ Recent Activity   │ Top Clients       │ Popular Services  │
│                   │                   │                   │
│ • AGGF - $50K     │ 1. AGGF - $150K   │ 🎯 HubSpot (45)   │
│ • Lendlease -     │ 2. Lendlease -    │ 📱 Social (38)    │
│   $75K            │    $120K          │ 📧 Email (32)     │
│ • Stockland -     │ 3. Stockland -    │ 🎨 Branding (28)  │
│   $42K            │    $98K           │ 📊 Analytics (21) │
│                   │                   │                   │
└───────────────────┴───────────────────┴───────────────────┘
```

### Charts Row
```
┌─────────────────────────────┬─────────────────────────────┐
│  SOWs by Month (Bar Chart)  │  Value Distribution (Pie)   │
│  ▂▅▇▃▆▅▇█                   │        [Pie Chart]          │
└─────────────────────────────┴─────────────────────────────┘
```

### Quick Actions
```
┌───────────────────────────────────────────────────────────┐
│  [+ New SOW]  [📊 Export Report]  [🤖 Ask Dashboard AI]   │
└───────────────────────────────────────────────────────────┘
```

---

## 🔧 Technical Implementation

### 1. Dashboard Component
**File**: `/components/sow-dashboard.tsx`

**Features**:
- Real-time stats from AnythingLLM master workspace
- Chart.js/Recharts for visualizations
- Responsive grid layout (Tailwind)
- Dark mode support with AnythingLLM colors (#1B1B1E, #0E0F0F)

### 2. Data Fetching Strategy

#### Option A: Direct AI Query (Recommended)
```typescript
// Ask the master dashboard AI for stats
const stats = await anythingLLM.queryDashboard([
  "Total number of SOWs",
  "Total value of all SOWs in AUD",
  "Number of active SOWs",
  "SOWs created this month"
]);
```

#### Option B: Database Queries
```typescript
// Query MySQL directly for fast stats
const stats = await fetch('/api/dashboard/stats');
```

### 3. Real-time Updates
- **WebSocket** connection to master workspace
- **Polling** every 30 seconds for new data
- **SSE** (Server-Sent Events) for live updates

---

## 🎨 Design Specs

### Color Palette (Dark Mode)
```
Background:     #1B1B1E (AnythingLLM main)
Cards:          #0E0F0F (AnythingLLM secondary)
Text:           #FFFFFF (white)
Accent:         #20e28f (Social Garden green)
Charts:         #0e2e33, #20e28f, #3d9970, #2ecc71
```

### Typography
```
Headings:  Inter, 600 weight
Body:      Inter, 400 weight
Numbers:   Inter, 700 weight (for stats)
```

### Spacing
```
Card padding:   24px
Grid gap:       20px
Section gap:    40px
```

---

## 📋 Data Structure

### Dashboard Stats Interface
```typescript
interface DashboardStats {
  totalSOWs: number;
  totalValue: number;
  activeSOWs: number;
  thisMonthSOWs: number;
  recentActivity: Array<{
    clientName: string;
    sowTitle: string;
    value: number;
    date: string;
  }>;
  topClients: Array<{
    name: string;
    totalValue: number;
    sowCount: number;
  }>;
  popularServices: Array<{
    service: string;
    count: number;
    percentage: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    count: number;
    value: number;
  }>;
}
```

---

## 🚀 Implementation Steps

### Phase 1: Basic Dashboard (30 min)
- [ ] Create dashboard component
- [ ] Add 4 stat cards at top
- [ ] Fetch data from master workspace AI
- [ ] Add "New SOW" button

### Phase 2: Activity Feed (20 min)
- [ ] Recent activity list
- [ ] Top clients list
- [ ] Popular services list

### Phase 3: Charts (30 min)
- [ ] Install recharts: `pnpm add recharts`
- [ ] Monthly trend bar chart
- [ ] Value distribution pie chart

### Phase 4: Interactive Features (20 min)
- [ ] "Ask Dashboard AI" button
- [ ] Export report button
- [ ] Click stats to drill down

---

## 🎯 User Flow

### On App Load:
1. Show dashboard as home screen
2. Fetch stats from master workspace
3. Display overview

### User Actions:
```
Dashboard
  ├─ Click "New SOW" → Guided setup (folder first)
  ├─ Click stat card → Filter/drill down
  ├─ Click client → View client's SOWs
  └─ Click "Ask AI" → Chat with master workspace
```

---

## 💡 Smart Features

### 1. AI-Powered Insights
- "Your average deal size increased 15% this quarter"
- "HubSpot services are trending up"
- "Follow up with AGGF - no activity in 30 days"

### 2. Quick Actions
- "Create SOW for AGGF" (pre-fills client)
- "Duplicate last SOW"
- "Send SOW to client"

### 3. Filters
- By date range
- By client
- By service type
- By value range

---

## 📊 Sample API Queries

### Get Dashboard Stats
```typescript
// Query the master dashboard AI
const query = `Provide the following statistics in JSON format:
{
  "totalSOWs": number,
  "totalValue": number in AUD,
  "activeSOWs": number of unsent SOWs,
  "thisMonthSOWs": SOWs created this month,
  "topClients": top 5 clients by value with names and amounts,
  "popularServices": top 5 services with counts
}`;

const response = await anythingLLM.chatWithWorkspace(
  'sow-master-dashboard',
  query
);
```

### Alternative: Direct DB Query
```sql
SELECT 
  COUNT(*) as total_sows,
  SUM(total_investment) as total_value,
  COUNT(CASE WHEN sent_at IS NULL THEN 1 END) as active_sows,
  COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN 1 END) as this_month
FROM documents
WHERE content LIKE '%Statement of Work%';
```

---

## 🎨 Wireframe ASCII

```
╔════════════════════════════════════════════════════════════╗
║  SOW DASHBOARD                      [🔍 Search] [⚙️ Settings] ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    ║
║  │ 127 SOWs │ │ $2.4M    │ │ 23 Active│ │ 12 This  │    ║
║  │ Total    │ │ Total    │ │ Proposals│ │ Month    │    ║
║  └──────────┘ └──────────┘ └──────────┘ └──────────┘    ║
║                                                            ║
║  ┌─────────────────┬─────────────────┬─────────────────┐ ║
║  │ Recent Activity │ Top Clients     │ Popular Services│ ║
║  ├─────────────────┼─────────────────┼─────────────────┤ ║
║  │ • AGGF - $50K   │ 1. AGGF $150K   │ 🎯 HubSpot (45) │ ║
║  │   2 hours ago   │    15 SOWs      │ 📱 Social (38)  │ ║
║  │                 │                 │ 📧 Email (32)   │ ║
║  │ • Lendlease -   │ 2. Lendlease    │ 🎨 Brand (28)   │ ║
║  │   $75K          │    $120K        │ 📊 Analytics    │ ║
║  │   5 hours ago   │    12 SOWs      │    (21)         │ ║
║  └─────────────────┴─────────────────┴─────────────────┘ ║
║                                                            ║
║  ┌────────────────────────────────────────────────────┐  ║
║  │  SOWs by Month                                     │  ║
║  │  █                                                 │  ║
║  │  █ ▓                                               │  ║
║  │  █ ▓ ░ ▒ ▓ █                                      │  ║
║  │  J F M A M J J A S O N D                          │  ║
║  └────────────────────────────────────────────────────┘  ║
║                                                            ║
║  [+ New SOW] [📊 Export] [🤖 Ask Dashboard AI]            ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

---

## ✅ Benefits

1. **At-a-Glance Overview**: See business health instantly
2. **Data-Driven Decisions**: Identify trends and opportunities
3. **Quick Access**: Jump to creating SOW with context
4. **Client Intelligence**: Know which clients need attention
5. **Service Insights**: See which services are most popular

---

## 🚀 Ready to Build?

Say the word and I'll:
1. Create the dashboard component
2. Wire up the AI queries
3. Add the charts
4. Make it the home screen

This will be CLEAN and PROFESSIONAL! 🎨
