# SME SAGE: AI-Powered SME Decision Intelligence Platform

> **"Turn Business Data into Better Decisions"**  
> *Your AI Business Decision Copilot — Not just a generic dashboard.*

---

## 1. Product Vision

Small and Medium Enterprises (SMEs) run on data locked in Excel, POS systems, inventory logs, accounting sheets, and customer records. Traditional Business Intelligence dashboards only answer:

$$\text{"What happened?"}$$

**SME SAGE** bridges the critical gap from hindsight to foresight and operational action:

$$\text{RAW DATA} \longrightarrow \text{UNDERSTAND} \longrightarrow \text{DETECT} \longrightarrow \text{EXPLAIN} \longrightarrow \text{RECOMMEND} \longrightarrow \text{SIMULATE} \longrightarrow \text{DECIDE} \longrightarrow \text{TRACK}$$

---

## 2. Architecture & Tech Stack

```
sme-sage/
├── backend/                  # Node.js + Express + TypeScript Backend
│   ├── src/
│   │   ├── database/         # SQLite WASM database layer & deterministic demo seeder
│   │   ├── engines/          # Intelligence Engine, Simulator Engine, Assistant, Cleaner
│   │   ├── routes/           # REST API endpoints (Auth, Dashboard, Inventory, etc.)
│   │   └── index.ts          # Server entrypoint (Port 5000)
│   ├── package.json
│   └── .env.example
├── frontend/                 # React 18 + Vite + TypeScript + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/       # Layouts, StatCards, HealthScoreGauge, Modals, Badges
│   │   ├── context/          # BusinessContext, ToastContext
│   │   ├── pages/            # Dashboard, Analytics, Simulator, Assistant, Reports, etc.
│   │   ├── services/         # Unified API Client
│   │   └── App.tsx
│   └── package.json
├── database/                 # Persistent SQLite database storage (sme_sage.db)
├── shared/                   # Shared TypeScript models and interfaces
└── docs/                     # Documentation & Hackathon presentation guides
```

---

## 3. Instant Demo: UrbanKart Retail

The platform runs completely locally without requiring external hardware or paid API keys. Clicking **"LOAD DEMO SME"** immediately instantiates **UrbanKart Retail** (Consumer Electronics):

- **Products**:
  1. *Smart Watch* (Steady earner, 40% margin)
  2. *Wireless Earbuds* (**Growth Leader**: +31% sales surge, top revenue generator at ₹2.06 Lakhs)
  3. *Mechanical Keyboard* (**Capital Lockup**: -22% sales slump, 420 units on hand = 5.1 months coverage, ₹6.30 Lakhs tied up)
  4. *Wireless Mouse* (Healthy accessory, 56.2% gross margin)
  5. *Power Bank* (**Stockout Emergency**: Stock at 18 units, below 30 reorder threshold, 9 days runway remaining)
  6. *Bluetooth Speaker* (**Slow Mover**: Low velocity, high holding duration)
- **Expense Spike**: Logistics courier fees surged **+21.1%** in recent month due to express carrier surcharges.
- **Business Health Score**: Deterministically calculated at **78 / 100** across 5 weighted pillars.

---

## 4. Key Engines & Mathematical Models

### A. Business Health Score (0 - 100)
$$\text{Health Score} = 0.25 \times \text{RevGrowth} + 0.25 \times \text{Profitability} + 0.20 \times \text{InventoryHealth} + 0.15 \times \text{CustomerRetention} + 0.15 \times \text{ExpenseControl}$$
- **Revenue Growth**: 82/100
- **Profitability**: 76/100
- **Inventory Health**: 71/100
- **Customer Retention**: 84/100
- **Expense Control**: 77/100
- **Overall**: **78 / 100** (*"Business health is stable, but inventory efficiency requires attention."*)

### B. Inventory Stock Coverage Formula
$$\text{Stock Coverage (months)} = \frac{\text{Current Stock}}{\text{Average Monthly Demand}}$$
- **Overstock**: $> 4.0\text{ months}$ (Mechanical Keyboard = 5.1 months)
- **Low Stock**: $< 1.0\text{ months}$ or $\text{Stock} \le \text{Reorder Level}$ (Power Bank = 0.3 months)
- **Healthy**: $1.0\text{ to }3.0\text{ months}$

### C. What-If Decision Simulator Engine
Calculates realistic business impacts before taking action:
$$\Delta Q\% = -\text{Elasticity} \times \frac{P_{\text{new}} - P_{\text{old}}}{P_{\text{old}}}$$
$$\text{Projected Revenue} = Q_{\text{proj}} \times P_{\text{new}}$$
$$\text{Projected Profit} = \text{Revenue}_{\text{proj}} - (Q_{\text{proj}} \times \text{Unit Cost}) - \text{Fixed Overhead}$$
$$\text{Working Capital Impact} = \Delta \text{Purchase Qty} \times \text{Unit Cost}$$

*Mandatory Disclaimer Displayed*:  
`"SIMULATED PROJECTION: Projection based on historical/demo data. Actual results may differ."`

### D. "Ask Your Business" Natural Language Assistant
Matches business inquiries against computed database records:
- *"Why did my profit decrease this month?"* $\to$ Unpacks the +21.1% logistics carrier surge and -22% keyboard drop with visual breakdown.
- *"Which product should I restock?"* $\to$ Flags Power Bank stockout within 9 days and calculates 80-unit purchase order.
- *"Which product is losing money?"* $\to$ Compares margins and flags ₹6.30 Lakhs in frozen keyboard inventory.
- *"What are my biggest expenses?"* $\to$ Explains Salaries (55.7%), Rent (19.6%), and Logistics (19.0%).

---

## 5. Quickstart & Local Installation

### Prerequisites
- Node.js (v18+ or v20+) and npm.

### 1. Start the Backend
```bash
cd backend
npm install
npm run dev
# Server will listen on http://localhost:5000
```

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
# Vite will serve on http://localhost:3000
```

Open **`http://localhost:3000`** in your browser to start using SME SAGE!

---

## 6. Exact Hackathon Presentation Flow

1. **Step 1**: Open `http://localhost:3000`. Show the sleek landing page with the **Continuous Decision Pipeline** graphic.
2. **Step 2**: Click **"VIEW DEMO"** or **"LOAD DEMO SME"**.
3. **Step 3**: The dashboard loads instantly with UrbanKart Retail's live KPIs and the **78/100 Business Health Score**.
4. **Step 4**: Navigate to **AI Insights**. Review the 5 diagnostic cards (Keyboard drop -22%, Overstock 5.1 months, Logistics surge +21%).
5. **Step 5**: Click **"SIMULATE THIS ACTION"** on the Mechanical Keyboard or Earbuds card.
6. **Step 6**: The **Decision Simulator** opens pre-configured. Adjust the price or discount slider to view the live projected revenue, profit, demand difference, and disclaimer.
7. **Step 7**: Click **"APPLY SCENARIO"** and save as a formal business decision.
8. **Step 8**: Navigate to **Ask Your Business**. Click *"Why did my profit decrease this month?"* to show data-backed root-cause analysis with supporting charts.
9. **Step 9**: Navigate to **Inventory** to inspect the stock coverage formula and click *"Reorder"* on Power Bank.
10. **Step 10**: Navigate to **Executive Reports** to view the printable stakeholder dossier.

---

## 7. API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status |
| `POST` | `/api/auth/demo` | 1-click Demo mode authentication |
| `POST` | `/api/data/demo` | Seed / Reset UrbanKart Retail demo dataset |
| `POST` | `/api/data/upload` | Upload CSV/Excel with auto-cleaning and quality scoring |
| `GET` | `/api/dashboard` | Executive KPIs, Health score, and monthly trends |
| `GET` | `/api/analytics/sales` | Sales timeline, category distribution, product ranks |
| `GET` | `/api/analytics/expenses`| Overhead breakdown & cost surge alerts |
| `GET` | `/api/analytics/profitability` | Margin spectrum by SKU |
| `GET` | `/api/inventory` | Inventory value, status, stock coverage months |
| `POST` | `/api/inventory/reorder` | Replenish inventory purchase order |
| `GET` | `/api/customers` | RFM segments and 90-day inactivity churn alert |
| `GET` | `/api/insights` | Anomaly diagnostics with simulation presets |
| `POST` | `/api/simulator` | What-If decision simulation with elasticity |
| `GET` | `/api/decisions` | Decision history audit trail |
| `POST` | `/api/decisions` | Commit new business decision |
| `POST` | `/api/ai/assistant` | Grounded Q&A with quantitative metrics |
| `GET` | `/api/alerts` | Critical, warning, and positive notifications |
| `GET` | `/api/reports/generate` | Executive printable business dossier |
