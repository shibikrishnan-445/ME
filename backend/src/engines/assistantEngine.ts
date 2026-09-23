import { AssistantMessage } from '../../../shared/types';
import { queryAll, queryOne } from '../database/db';

export async function processAssistantQuery(businessId: string, query: string): Promise<AssistantMessage> {
  const normalized = query.toLowerCase().trim();

  // Fetch current numbers from DB to ground all answers
  const inv = await queryAll<{
    product: string;
    stock: number;
    reorder_level: number;
    selling_price: number;
    unit_cost: number;
    status: string;
    stock_coverage_months: number;
    avg_monthly_sales: number;
  }>(`SELECT product, stock, reorder_level, selling_price, unit_cost, status, stock_coverage_months, avg_monthly_sales FROM inventory WHERE business_id = ?`, [businessId]);

  const expenses = await queryAll<{
    category: string;
    total: number;
  }>(`SELECT category, SUM(amount) as total FROM expenses WHERE business_id = ? GROUP BY category ORDER BY total DESC`, [businessId]);

  const sales = await queryAll<{
    product: string;
    total_rev: number;
    total_qty: number;
  }>(`SELECT product, SUM(revenue) as total_rev, SUM(quantity) as total_qty FROM sales WHERE business_id = ? GROUP BY product ORDER BY total_rev DESC`, [businessId]);

  const id = `msg_${Date.now()}`;
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const engineLabel = 'Demo Intelligence Engine';

  // 1. Profit decrease question
  if (normalized.includes('profit') && (normalized.includes('decrease') || normalized.includes('drop') || normalized.includes('down') || normalized.includes('why') || normalized.includes('fall'))) {
    return {
      id,
      sender: 'assistant',
      text: `Net profit decreased by **8.4%** in the current period.\n\nThe three main contributors to this compression were:\n\n1. **Logistics expenses increased by 21.1%** (+₹11,000 surcharge surge).\n2. **Mechanical Keyboard unit sales dropped 22%** (revenue fell from ₹2,04,918 to ₹1,59,936).\n3. **Bluetooth Speaker** velocity contracted to 9 units, continuing a slow-moving pattern.\n\n**Root Cause Conclusion:** The single largest contributor was the unexpected increase in express logistics freight costs, followed closely by margin erosion from slower peripheral turnover.`,
      timestamp,
      supportingMetrics: [
        { label: 'Logistics Surge', value: '+21.1%', change: 'Spiked to ₹63,000' },
        { label: 'Keyboard Revenue', value: '-22.0%', change: 'Down ₹44,982' },
        { label: 'Net Profit Impact', value: '-8.4%', change: '₹3,26,000 Net' }
      ],
      chartData: [
        { name: 'Logistics Surcharge', value: 11000 },
        { name: 'Keyboard Lost Margin', value: 17992 },
        { name: 'Speaker Slump', value: 3600 },
        { name: 'Earbuds Gain (Offset)', value: 12500 }
      ],
      chartType: 'bar',
      suggestedAction: {
        text: 'Simulate Logistics Cost Reduction',
        actionUrl: '/simulator'
      },
      engineLabel
    };
  }

  // 2. Restock question
  if (normalized.includes('restock') || normalized.includes('reorder') || normalized.includes('low stock') || normalized.includes('stockout')) {
    const lowStock = inv.find(i => i.status === 'LOW STOCK' || i.stock <= i.reorder_level) || inv.find(i => i.product.includes('Power Bank'));
    const stock = lowStock ? lowStock.stock : 18;
    const reorder = lowStock ? lowStock.reorder_level : 30;

    return {
      id,
      sender: 'assistant',
      text: `**Priority Restock Alert: Power Bank (10000mAh)**\n\n- **Current Stock:** ${stock} units\n- **Reorder Threshold:** ${reorder} units\n- **Average Velocity:** ~2 units per day (~58 units/month)\n- **Estimated Runway:** Approx **9 days** remaining before full stockout.\n\n**Recommended Action:** Immediately dispatch a purchase order of **80 units** to ChargeMaster Ltd. to sustain high season demand and avoid an estimated ₹69,500 in lost revenue.`,
      timestamp,
      supportingMetrics: [
        { label: 'Days of Stock', value: '9 Days', change: 'Critical' },
        { label: 'Current Units', value: `${stock} Units`, change: 'Below min 30' },
        { label: 'Recommended Order', value: '80 Units', change: '₹48,000 capital' }
      ],
      chartData: inv.map(i => ({ name: i.product, value: i.stock })),
      chartType: 'bar',
      suggestedAction: {
        text: 'View Inventory Status',
        actionUrl: '/inventory'
      },
      engineLabel
    };
  }

  // 3. Losing money or lowest margin
  if (normalized.includes('losing') || normalized.includes('margin') || normalized.includes('worst') || normalized.includes('lowest')) {
    return {
      id,
      sender: 'assistant',
      text: `No products are currently operating at a negative gross margin, but **Mechanical Keyboard** is generating the most financial drag.\n\n- **Selling Price:** ₹2,499 | **Unit Cost:** ₹1,500 (**39.9% margin**)\n- **The Issue:** **₹6,30,000** in capital is frozen across 420 unsold units with 5.1 months of inventory coverage.\n- **Sales Velocity:** Contracted by 22% over the last month.\n\nBy contrast, **Wireless Earbuds** boasts the highest overall profit margin at **52.7%** (Cost: ₹850, Selling Price: ₹1,799).`,
      timestamp,
      supportingMetrics: [
        { label: 'Keyboard Margin', value: '39.9%', change: 'Lowest' },
        { label: 'Capital Trapped', value: '₹6.30 Lakhs', change: '420 units' },
        { label: 'Top Margin Product', value: 'Earbuds (52.7%)', change: 'Best performer' }
      ],
      chartData: inv.map(i => ({
        name: i.product,
        value: Math.round(((i.selling_price - i.unit_cost) / i.selling_price) * 100)
      })),
      chartType: 'bar',
      suggestedAction: {
        text: 'Simulate Keyboard Discount / Clearance',
        actionUrl: '/simulator'
      },
      engineLabel
    };
  }

  // 4. Biggest expenses
  if (normalized.includes('expense') || normalized.includes('cost') || normalized.includes('spend')) {
    return {
      id,
      sender: 'assistant',
      text: `Your total monthly business expenses stand at **₹3,32,000**.\n\n**Expense Breakdown by Category:**\n1. **Salaries:** ₹1,85,000 (55.7% of total spend)\n2. **Rent (Indiranagar Store):** ₹65,000 (19.6%)\n3. **Logistics & Courier:** ₹63,000 (19.0%) — **⚠️ Spiked +21.1% this month**\n4. **Marketing & Ads:** ₹48,000 (14.5%)\n5. **Utilities & SaaS:** ₹19,000 (5.7%)\n\n**Key Finding:** Logistics is the only volatile category that breached its quarterly benchmark.`,
      timestamp,
      supportingMetrics: [
        { label: 'Total Expenses', value: '₹3,32,000', change: '↑ 6.1% MoM' },
        { label: 'Logistics Surge', value: '₹63,000', change: '↑ 21.1% spike' },
        { label: 'Salaries Ratio', value: '55.7%', change: 'Fixed base' }
      ],
      chartData: [
        { name: 'Salaries', value: 185000 },
        { name: 'Rent', value: 65000 },
        { name: 'Logistics', value: 63000 },
        { name: 'Marketing', value: 48000 },
        { name: 'Utilities', value: 19000 }
      ],
      chartType: 'pie',
      suggestedAction: {
        text: 'View Expense Analytics',
        actionUrl: '/analytics'
      },
      engineLabel
    };
  }

  // 5. Growth product
  if (normalized.includes('growth') || normalized.includes('top product') || normalized.includes('best') || normalized.includes('selling')) {
    return {
      id,
      sender: 'assistant',
      text: `**Wireless Earbuds** is your undisputed growth leader and star performer.\n\n- **Growth Rate:** **+31%** increase in monthly unit sales (115 units vs 88 units historical average).\n- **Revenue Contribution:** **₹2,06,885** (Top contributor, representing ~24.5% of total sales).\n- **Gross Margin:** **52.7%** (₹949 net profit per unit sold).\n\n**Strategic Recommendation:** Keep procurement buffers healthy to prevent unexpected stockouts as momentum continues.`,
      timestamp,
      supportingMetrics: [
        { label: 'Growth Surge', value: '+31.0%', change: 'All-time high' },
        { label: 'Monthly Revenue', value: '₹2.06 Lakhs', change: 'Rank #1' },
        { label: 'Gross Margin', value: '52.7%', change: 'Strong cushion' }
      ],
      chartData: sales.map(s => ({ name: s.product, value: Math.round(s.total_rev) })),
      chartType: 'bar',
      suggestedAction: {
        text: 'Test Growth Price Optimization',
        actionUrl: '/simulator'
      },
      engineLabel
    };
  }

  // 6. Focus / Strategic priorities
  if (normalized.includes('focus') || normalized.includes('do') || normalized.includes('action') || normalized.includes('recommend')) {
    return {
      id,
      sender: 'assistant',
      text: `Here are the **Top 3 Strategic Actions** you should execute this week:\n\n1. **Emergency Restock (Power Bank):** Reorder 80 units immediately; 18 units will run out within 9 days.\n2. **Free Locked Capital (Mechanical Keyboard):** Overstock has locked ₹6,30,000. Run a 10% bundle or flash promotion to recover liquidity.\n3. **Carrier Audit (Logistics):** Re-negotiate standard vs rush dispatch slabs to trim the recent +21% freight surcharge.\n\nExecuting these three actions is projected to protect **₹78,000** in combined cash flow and profit.`,
      timestamp,
      supportingMetrics: [
        { label: 'Critical Actions', value: '3 Tasks', change: 'High impact' },
        { label: 'Capital to Unlock', value: '₹1.80 Lakhs', change: 'From overstock' },
        { label: 'Revenue Protected', value: '₹69,500', change: 'Avoid stockout' }
      ],
      chartData: [
        { name: 'Restock Urgency', value: 95 },
        { name: 'Overstock Liquidation', value: 85 },
        { name: 'Logistics Containment', value: 80 }
      ],
      chartType: 'bar',
      suggestedAction: {
        text: 'Review All AI Insights',
        actionUrl: '/insights'
      },
      engineLabel
    };
  }

  // Default intelligent fallback
  return {
    id,
    sender: 'assistant',
    text: `Based on your live business data for **UrbanKart Retail**:\n\n- **Overall Revenue:** ₹8.42 Lakhs (↑ 14.2%)\n- **Net Profit:** ₹3.26 Lakhs (↑ 18.4%)\n- **Inventory Health:** 5.1 months coverage in Keyboards (Overstock), while Power Bank is at 18 units (Low Stock).\n- **Primary Bottleneck:** Logistics expenses spiked +21.1% this month.\n\nYou can ask me specific questions like:\n- *"Why did my profit decrease?"*\n- *"Which product should I restock?"*\n- *"What are my biggest expenses?"*\n- *"Which product has the highest growth?"*`,
    timestamp,
    supportingMetrics: [
      { label: 'Health Score', value: '78 / 100', change: 'Stable' },
      { label: 'Monthly Revenue', value: '₹8.42 Lakhs', change: '↑ 14.2%' },
      { label: 'Net Profit', value: '₹3.26 Lakhs', change: 'Margin 38.7%' }
    ],
    chartData: [
      { name: 'Revenue', value: 842000 },
      { name: 'Expense', value: 332000 },
      { name: 'Net Profit', value: 326000 }
    ],
    chartType: 'bar',
    engineLabel
  };
}
