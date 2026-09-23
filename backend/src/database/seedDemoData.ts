import { getDb, runQuery, persistDb } from './db';

export const DEMO_BUSINESS_ID = 'biz_urbankart_demo';
export const DEMO_USER_ID = 'user_demo_owner';

export async function seedDemoData(): Promise<void> {
  const db = await getDb();

  // Clean existing demo data
  db.run(`DELETE FROM sales WHERE business_id = '${DEMO_BUSINESS_ID}'`);
  db.run(`DELETE FROM expenses WHERE business_id = '${DEMO_BUSINESS_ID}'`);
  db.run(`DELETE FROM inventory WHERE business_id = '${DEMO_BUSINESS_ID}'`);
  db.run(`DELETE FROM customers WHERE business_id = '${DEMO_BUSINESS_ID}'`);
  db.run(`DELETE FROM insights WHERE business_id = '${DEMO_BUSINESS_ID}'`);
  db.run(`DELETE FROM alerts WHERE business_id = '${DEMO_BUSINESS_ID}'`);
  db.run(`DELETE FROM decisions WHERE business_id = '${DEMO_BUSINESS_ID}'`);
  db.run(`DELETE FROM businesses WHERE id = '${DEMO_BUSINESS_ID}'`);
  db.run(`DELETE FROM users WHERE id = '${DEMO_USER_ID}'`);

  // 1. Insert Demo User & Business
  db.run(`
    INSERT INTO users (id, name, email, password_hash, role)
    VALUES ('${DEMO_USER_ID}', 'Rajesh Sharma', 'demo@urbankart.com', 'demo_hash_123', 'owner')
  `);

  db.run(`
    INSERT INTO businesses (id, user_id, name, business_type, employees, monthly_revenue_range, primary_products, location, currency, is_demo)
    VALUES (
      '${DEMO_BUSINESS_ID}',
      '${DEMO_USER_ID}',
      'UrbanKart Retail',
      'Retail',
      8,
      '₹6,00,000 - ₹10,00,000',
      '["Smart Watch","Wireless Earbuds","Mechanical Keyboard","Wireless Mouse","Power Bank","Bluetooth Speaker"]',
      'Indiranagar, Bangalore',
      '₹',
      1
    )
  `);

  // 2. Insert Inventory Items with precise deterministic health metrics
  const inventoryItems = [
    {
      id: 'inv_1',
      product: 'Smart Watch',
      category: 'Wearables',
      stock: 85,
      reorder_level: 25,
      unit_cost: 1800,
      selling_price: 2999,
      supplier: 'Apex Tech Electronics',
      avg_monthly_sales: 42,
      stock_coverage_months: 2.0,
      status: 'HEALTHY',
      ai_explanation: 'Stock level is optimal with 2.0 months of expected demand. Sell-through rate is consistent.'
    },
    {
      id: 'inv_2',
      product: 'Wireless Earbuds',
      category: 'Audio',
      stock: 110,
      reorder_level: 40,
      unit_cost: 850,
      selling_price: 1799,
      supplier: 'SoundWave Global',
      avg_monthly_sales: 95,
      stock_coverage_months: 1.2,
      status: 'HEALTHY',
      ai_explanation: 'Top revenue generator experiencing strong +31% growth. Stock coverage is 1.2 months; monitor closely as demand surges.'
    },
    {
      id: 'inv_3',
      product: 'Mechanical Keyboard',
      category: 'Peripherals',
      stock: 420,
      reorder_level: 40,
      unit_cost: 1500,
      selling_price: 2499,
      supplier: 'KeyForge Manufacturing',
      avg_monthly_sales: 82,
      stock_coverage_months: 5.1,
      status: 'OVERSTOCK',
      ai_explanation: 'Current stock represents approximately 5.1 months of expected demand while recent sales declined 22%. ₹6,30,000 capital is tied up.'
    },
    {
      id: 'inv_4',
      product: 'Wireless Mouse',
      category: 'Peripherals',
      stock: 145,
      reorder_level: 35,
      unit_cost: 350,
      selling_price: 799,
      supplier: 'OmniGadget Co.',
      avg_monthly_sales: 70,
      stock_coverage_months: 2.1,
      status: 'HEALTHY',
      ai_explanation: 'Healthy inventory coverage of 2.1 months with steady monthly reorder cycles.'
    },
    {
      id: 'inv_5',
      product: 'Power Bank',
      category: 'Accessories',
      stock: 18,
      reorder_level: 30,
      unit_cost: 600,
      selling_price: 1199,
      supplier: 'ChargeMaster Ltd.',
      avg_monthly_sales: 58,
      stock_coverage_months: 0.3,
      status: 'LOW STOCK',
      ai_explanation: 'CRITICAL: Stock (18 units) has dropped below reorder level (30 units). Estimated 9 days of inventory remaining before stockout.'
    },
    {
      id: 'inv_6',
      product: 'Bluetooth Speaker',
      category: 'Audio',
      stock: 65,
      reorder_level: 15,
      unit_cost: 900,
      selling_price: 1499,
      supplier: 'SoundWave Global',
      avg_monthly_sales: 12,
      stock_coverage_months: 5.4,
      status: 'SLOW MOVING',
      ai_explanation: 'Slow moving product with 5.4 months coverage and low sales velocity. Consider bundling with Wireless Earbuds.'
    }
  ];

  for (const item of inventoryItems) {
    db.run(`
      INSERT INTO inventory (id, business_id, product, category, stock, reorder_level, unit_cost, selling_price, supplier, avg_monthly_sales, stock_coverage_months, status, ai_explanation)
      VALUES ('${item.id}', '${DEMO_BUSINESS_ID}', '${item.product}', '${item.category}', ${item.stock}, ${item.reorder_level}, ${item.unit_cost}, ${item.selling_price}, '${item.supplier}', ${item.avg_monthly_sales}, ${item.stock_coverage_months}, '${item.status}', '${item.ai_explanation}')
    `);
  }

  // 3. Insert Historical Sales Data (6 months: Apr - Sep 2026)
  // Deterministic patterns:
  // - Wireless Earbuds: Apr(62) -> May(71) -> Jun(78) -> Jul(84) -> Aug(91) -> Sep(115) [Surging!]
  // - Mechanical Keyboard: Apr(110) -> May(105) -> Jun(98) -> Jul(92) -> Aug(82) -> Sep(64) [-22% drop!]
  // - Smart Watch: Apr(38) -> May(40) -> Jun(42) -> Jul(39) -> Aug(44) -> Sep(46) [Steady]
  // - Wireless Mouse: Apr(68) -> May(70) -> Jun(65) -> Jul(72) -> Aug(69) -> Sep(74) [Steady]
  // - Power Bank: Apr(50) -> May(55) -> Jun(60) -> Jul(58) -> Aug(62) -> Sep(65) [High velocity, low stock]
  // - Bluetooth Speaker: Apr(15) -> May(14) -> Jun(11) -> Jul(10) -> Aug(13) -> Sep(9) [Slow mover]

  const salesData = [
    // Month 1: 2026-04
    { date: '2026-04-10', product: 'Smart Watch', category: 'Wearables', qty: 38, price: 2999, cost: 1800, cust: 'CUST-101' },
    { date: '2026-04-12', product: 'Wireless Earbuds', category: 'Audio', qty: 62, price: 1799, cost: 850, cust: 'CUST-102' },
    { date: '2026-04-15', product: 'Mechanical Keyboard', category: 'Peripherals', qty: 110, price: 2499, cost: 1500, cust: 'CUST-103' },
    { date: '2026-04-18', product: 'Wireless Mouse', category: 'Peripherals', qty: 68, price: 799, cost: 350, cust: 'CUST-104' },
    { date: '2026-04-22', product: 'Power Bank', category: 'Accessories', qty: 50, price: 1199, cost: 600, cust: 'CUST-105' },
    { date: '2026-04-28', product: 'Bluetooth Speaker', category: 'Audio', qty: 15, price: 1499, cost: 900, cust: 'CUST-106' },

    // Month 2: 2026-05
    { date: '2026-05-08', product: 'Smart Watch', category: 'Wearables', qty: 40, price: 2999, cost: 1800, cust: 'CUST-107' },
    { date: '2026-05-11', product: 'Wireless Earbuds', category: 'Audio', qty: 71, price: 1799, cost: 850, cust: 'CUST-108' },
    { date: '2026-05-16', product: 'Mechanical Keyboard', category: 'Peripherals', qty: 105, price: 2499, cost: 1500, cust: 'CUST-109' },
    { date: '2026-05-19', product: 'Wireless Mouse', category: 'Peripherals', qty: 70, price: 799, cost: 350, cust: 'CUST-110' },
    { date: '2026-05-24', product: 'Power Bank', category: 'Accessories', qty: 55, price: 1199, cost: 600, cust: 'CUST-111' },
    { date: '2026-05-29', product: 'Bluetooth Speaker', category: 'Audio', qty: 14, price: 1499, cost: 900, cust: 'CUST-112' },

    // Month 3: 2026-06
    { date: '2026-06-07', product: 'Smart Watch', category: 'Wearables', qty: 42, price: 2999, cost: 1800, cust: 'CUST-113' },
    { date: '2026-06-12', product: 'Wireless Earbuds', category: 'Audio', qty: 78, price: 1799, cost: 850, cust: 'CUST-114' },
    { date: '2026-06-15', product: 'Mechanical Keyboard', category: 'Peripherals', qty: 98, price: 2499, cost: 1500, cust: 'CUST-115' },
    { date: '2026-06-20', product: 'Wireless Mouse', category: 'Peripherals', qty: 65, price: 799, cost: 350, cust: 'CUST-116' },
    { date: '2026-06-25', product: 'Power Bank', category: 'Accessories', qty: 60, price: 1199, cost: 600, cust: 'CUST-117' },
    { date: '2026-06-28', product: 'Bluetooth Speaker', category: 'Audio', qty: 11, price: 1499, cost: 900, cust: 'CUST-118' },

    // Month 4: 2026-07
    { date: '2026-07-06', product: 'Smart Watch', category: 'Wearables', qty: 39, price: 2999, cost: 1800, cust: 'CUST-119' },
    { date: '2026-07-11', product: 'Wireless Earbuds', category: 'Audio', qty: 84, price: 1799, cost: 850, cust: 'CUST-120' },
    { date: '2026-07-17', product: 'Mechanical Keyboard', category: 'Peripherals', qty: 92, price: 2499, cost: 1500, cust: 'CUST-121' },
    { date: '2026-07-21', product: 'Wireless Mouse', category: 'Peripherals', qty: 72, price: 799, cost: 350, cust: 'CUST-122' },
    { date: '2026-07-26', product: 'Power Bank', category: 'Accessories', qty: 58, price: 1199, cost: 600, cust: 'CUST-123' },
    { date: '2026-07-30', product: 'Bluetooth Speaker', category: 'Audio', qty: 10, price: 1499, cost: 900, cust: 'CUST-124' },

    // Month 5: 2026-08 (Previous Period)
    { date: '2026-08-04', product: 'Smart Watch', category: 'Wearables', qty: 44, price: 2999, cost: 1800, cust: 'CUST-125' },
    { date: '2026-08-09', product: 'Wireless Earbuds', category: 'Audio', qty: 91, price: 1799, cost: 850, cust: 'CUST-126' },
    { date: '2026-08-14', product: 'Mechanical Keyboard', category: 'Peripherals', qty: 82, price: 2499, cost: 1500, cust: 'CUST-127' },
    { date: '2026-08-19', product: 'Wireless Mouse', category: 'Peripherals', qty: 69, price: 799, cost: 350, cust: 'CUST-128' },
    { date: '2026-08-23', product: 'Power Bank', category: 'Accessories', qty: 62, price: 1199, cost: 600, cust: 'CUST-129' },
    { date: '2026-08-28', product: 'Bluetooth Speaker', category: 'Audio', qty: 13, price: 1499, cost: 900, cust: 'CUST-130' },

    // Month 6: 2026-09 (Current Month / Recent Period - Strong overall revenue ₹8,42,000)
    { date: '2026-09-02', product: 'Smart Watch', category: 'Wearables', qty: 46, price: 2999, cost: 1800, cust: 'CUST-101' },
    { date: '2026-09-05', product: 'Wireless Earbuds', category: 'Audio', qty: 115, price: 1799, cost: 850, cust: 'CUST-102' },
    { date: '2026-09-10', product: 'Mechanical Keyboard', category: 'Peripherals', qty: 64, price: 2499, cost: 1500, cust: 'CUST-103' }, // Dropped from 82 to 64 (-22%)
    { date: '2026-09-14', product: 'Wireless Mouse', category: 'Peripherals', qty: 74, price: 799, cost: 350, cust: 'CUST-104' },
    { date: '2026-09-18', product: 'Power Bank', category: 'Accessories', qty: 65, price: 1199, cost: 600, cust: 'CUST-105' },
    { date: '2026-09-22', product: 'Bluetooth Speaker', category: 'Audio', qty: 9, price: 1499, cost: 900, cust: 'CUST-106' }
  ];

  let saleIdx = 1;
  for (const s of salesData) {
    const revenue = s.qty * s.price;
    const profit = revenue - (s.qty * s.cost);
    db.run(`
      INSERT INTO sales (id, business_id, date, product, category, quantity, unit_price, revenue, unit_cost, profit, customer_id)
      VALUES ('sale_${saleIdx++}', '${DEMO_BUSINESS_ID}', '${s.date}', '${s.product}', '${s.category}', ${s.qty}, ${s.price}, ${revenue}, ${s.cost}, ${profit}, '${s.cust}')
    `);
  }

  // 4. Insert Expenses (6 Months)
  // Intentional pattern: Logistics spiked by +21% in Aug->Sep (spiked from ₹52,000 to ₹63,000)
  const monthlyExpenses = [
    { month: '2026-04', rent: 65000, salaries: 180000, marketing: 42000, logistics: 48000, utilities: 16000 },
    { month: '2026-05', rent: 65000, salaries: 180000, marketing: 45000, logistics: 50000, utilities: 17000 },
    { month: '2026-06', rent: 65000, salaries: 180000, marketing: 44000, logistics: 49000, utilities: 16500 },
    { month: '2026-07', rent: 65000, salaries: 180000, marketing: 46000, logistics: 51000, utilities: 17500 },
    { month: '2026-08', rent: 65000, salaries: 180000, marketing: 45000, logistics: 52000, utilities: 18000 },
    { month: '2026-09', rent: 65000, salaries: 185000, marketing: 48000, logistics: 63000, utilities: 19000 } // Logistics spiked +21%
  ];

  let expIdx = 1;
  for (const m of monthlyExpenses) {
    db.run(`INSERT INTO expenses VALUES ('exp_${expIdx++}', '${DEMO_BUSINESS_ID}', '${m.month}-05', 'Rent', ${m.rent}, 'Facility lease Indiranagar store')`);
    db.run(`INSERT INTO expenses VALUES ('exp_${expIdx++}', '${DEMO_BUSINESS_ID}', '${m.month}-10', 'Salaries', ${m.salaries}, 'Store & support staff payroll')`);
    db.run(`INSERT INTO expenses VALUES ('exp_${expIdx++}', '${DEMO_BUSINESS_ID}', '${m.month}-15', 'Marketing', ${m.marketing}, 'Local digital ads & promotions')`);
    db.run(`INSERT INTO expenses VALUES ('exp_${expIdx++}', '${DEMO_BUSINESS_ID}', '${m.month}-20', 'Logistics', ${m.logistics}, 'Courier express dispatch & delivery')`);
    db.run(`INSERT INTO expenses VALUES ('exp_${expIdx++}', '${DEMO_BUSINESS_ID}', '${m.month}-25', 'Utilities & SaaS', ${m.utilities}, 'Electricity, POS SaaS & cloud services')`);
  }

  // 5. Insert Customer Records (VIPs, Regulars, Occasional, and At-Risk > 90 days inactive)
  const customers = [
    { id: 'CUST-101', name: 'Arun Verma', loc: 'Bangalore East', count: 14, spend: 58400, lastDate: '2026-09-18', segment: 'HIGH VALUE', days: 5 },
    { id: 'CUST-102', name: 'Pooja Iyer', loc: 'Koramangala', count: 12, spend: 47200, lastDate: '2026-09-20', segment: 'HIGH VALUE', days: 3 },
    { id: 'CUST-103', name: 'Vikram Mehta', loc: 'Whitefield', count: 9, spend: 36800, lastDate: '2026-09-15', segment: 'HIGH VALUE', days: 8 },
    { id: 'CUST-104', name: 'Sneha Nair', loc: 'HSR Layout', count: 6, spend: 18400, lastDate: '2026-09-02', segment: 'REGULAR', days: 21 },
    { id: 'CUST-105', name: 'Rohan Gupta', loc: 'Jayanagar', count: 5, spend: 14200, lastDate: '2026-08-28', segment: 'REGULAR', days: 26 },
    { id: 'CUST-106', name: 'Ananya Deshmukh', loc: 'Indiranagar', count: 4, spend: 11900, lastDate: '2026-08-15', segment: 'REGULAR', days: 39 },
    { id: 'CUST-107', name: 'Karthik Rao', loc: 'Electronic City', count: 2, spend: 5400, lastDate: '2026-07-10', segment: 'OCCASIONAL', days: 75 },
    { id: 'CUST-108', name: 'Divya Sen', loc: 'Malleshwaram', count: 2, spend: 4900, lastDate: '2026-06-25', segment: 'AT RISK', days: 90 },
    { id: 'CUST-109', name: 'Manish Joshi', loc: 'Hebbal', count: 3, spend: 7200, lastDate: '2026-06-08', segment: 'AT RISK', days: 107 },
    { id: 'CUST-110', name: 'Preeti Roy', loc: 'BTM Layout', count: 2, spend: 4200, lastDate: '2026-05-18', segment: 'AT RISK', days: 128 },
    { id: 'CUST-111', name: 'Sameer Kulkarni', loc: 'Bellandur', count: 1, spend: 2499, lastDate: '2026-05-02', segment: 'AT RISK', days: 144 },
    { id: 'CUST-112', name: 'Tanya Chawla', loc: 'MG Road', count: 1, spend: 1799, lastDate: '2026-04-18', segment: 'AT RISK', days: 158 }
  ];

  for (const c of customers) {
    db.run(`
      INSERT INTO customers (id, business_id, customer_id, name, location, purchase_count, total_spend, last_purchase_date, segment, days_since_last_purchase)
      VALUES ('${c.id}', '${DEMO_BUSINESS_ID}', '${c.id}', '${c.name}', '${c.loc}', ${c.count}, ${c.spend}, '${c.lastDate}', '${c.segment}', ${c.days})
    `);
  }

  // 6. Pre-generate deterministic AI Insights with 1-click simulation presets
  const insights = [
    {
      id: 'ins_1',
      category: 'Revenue Drop',
      severity: 'critical',
      title: 'Mechanical Keyboard Sales Decreased 22%',
      problem: 'Mechanical Keyboard monthly unit sales dropped from 82 to 64 units (-22%).',
      evidence: 'Monthly product revenue dropped from ₹2,04,918 to ₹1,59,936. Weekend store footfall showed reduced conversion for desk peripherals.',
      possible_reason: 'Price resistance at ₹2,499 combined with slowing conversion and lack of bundle incentives.',
      recommended_action: 'Simulate a price revision to ₹2,299 or provide a 10% bundle discount with Wireless Mouse to stimulate velocity.',
      simulation_preset: JSON.stringify({ scenarioType: 'price', product: 'Mechanical Keyboard', currentPrice: 2499, newPrice: 2299 })
    },
    {
      id: 'ins_2',
      category: 'Inventory Risk',
      severity: 'warning',
      title: 'Excess Overstock on Mechanical Keyboard (5.1 Months)',
      problem: 'Mechanical Keyboard has 420 units on hand, representing 5.1 months of sales coverage.',
      evidence: 'Working capital of ₹6,30,000 is tied up in stock while sales velocity is declining.',
      possible_reason: 'Previous purchase order of 250 units arrived right as demand softened.',
      recommended_action: 'Pause upcoming procurement orders and run a clearance bundle to free ₹1,80,000 in liquid capital.',
      simulation_preset: JSON.stringify({ scenarioType: 'purchase', product: 'Mechanical Keyboard', currentPurchaseQty: 100, newPurchaseQty: 0 })
    },
    {
      id: 'ins_3',
      category: 'Inventory Risk',
      severity: 'critical',
      title: 'Power Bank Approaching Stockout (18 Units Left)',
      problem: 'Power Bank stock has fallen to 18 units, well below the minimum reorder threshold of 30 units.',
      evidence: 'Average monthly demand is 58 units (approx 2 units/day). Current stock provides only 9 days of coverage.',
      possible_reason: 'Higher than anticipated sales during late-summer travel season; reorder was not triggered in time.',
      recommended_action: 'Immediately reorder 80 units from ChargeMaster Ltd. to prevent estimated ₹69,500 in lost revenue.',
      simulation_preset: JSON.stringify({ scenarioType: 'purchase', product: 'Power Bank', currentPurchaseQty: 0, newPurchaseQty: 80 })
    },
    {
      id: 'ins_4',
      category: 'Expense Spike',
      severity: 'warning',
      title: 'Logistics Expenses Spiked 21% This Month',
      problem: 'Logistics expenses surged from ₹52,000 to ₹63,000 (+21.1% increase).',
      evidence: 'Courier carrier invoice contains 34 rush delivery surcharges and regional fuel price escalation.',
      possible_reason: 'Increased usage of same-day rush shipping for e-commerce deliveries without customer surcharge.',
      recommended_action: 'Renegotiate carrier slab rates or consolidate weekly dispatch schedules to save approx ₹9,500 monthly.',
      simulation_preset: JSON.stringify({ scenarioType: 'expense', expenseCategory: 'Logistics', expenseReductionPercent: 15 })
    },
    {
      id: 'ins_5',
      category: 'Revenue Growth',
      severity: 'positive',
      title: 'Wireless Earbuds Demand Surged +31%',
      problem: 'High sales growth opportunity: Wireless Earbuds sales expanded 31% to 115 units.',
      evidence: 'Generated ₹2,06,885 in revenue this month with a solid 52.7% gross profit margin.',
      possible_reason: 'Positive customer word-of-mouth and back-to-college seasonal spike.',
      recommended_action: 'Maintain adequate stock buffer and test a modest price adjustment from ₹1,799 to ₹1,899.',
      simulation_preset: JSON.stringify({ scenarioType: 'price', product: 'Wireless Earbuds', currentPrice: 1799, newPrice: 1899 })
    }
  ];

  for (const ins of insights) {
    db.run(`
      INSERT INTO insights (id, business_id, category, severity, title, problem, evidence, possible_reason, recommended_action, simulation_preset, source)
      VALUES ('${ins.id}', '${DEMO_BUSINESS_ID}', '${ins.category}', '${ins.severity}', '${ins.title}', '${ins.problem}', '${ins.evidence}', '${ins.possible_reason}', '${ins.recommended_action}', '${ins.simulation_preset}', 'Demo Intelligence Engine')
    `);
  }

  // 7. Insert Smart Alerts
  const alerts = [
    { id: 'alt_1', type: 'LOW STOCK', priority: 'CRITICAL', title: 'Power Bank Critical Stockout Alert', desc: 'Stock is at 18 units (reorder level: 30). Stockout projected within 9 days.', mod: 'inventory' },
    { id: 'alt_2', type: 'OVERSTOCK', priority: 'WARNING', title: 'Mechanical Keyboard Capital Lockup', desc: '420 units in stock (5.1 months demand coverage). Overstock value: ₹6,30,000.', mod: 'inventory' },
    { id: 'alt_3', type: 'EXPENSE SPIKE', priority: 'WARNING', title: 'Logistics Costs Exceeded Budget by 21%', desc: 'Logistics expense reached ₹63,000 vs 3-month average of ₹50,666.', mod: 'analytics' },
    { id: 'alt_4', type: 'SALES GROWTH', priority: 'POSITIVE', title: 'Wireless Earbuds All-Time Revenue Record', desc: 'Monthly revenue crossed ₹2.06 Lakhs (+31% month-over-month growth).', mod: 'analytics' },
    { id: 'alt_5', type: 'CUSTOMER LOSS', priority: 'WARNING', title: '5 Customers Exceeded 90-Day Inactivity', desc: 'Identified 5 previously active buyers at risk of churn. Re-engagement promo advised.', mod: 'customers' }
  ];

  for (const a of alerts) {
    db.run(`
      INSERT INTO alerts (id, business_id, type, priority, title, description, target_module, is_read)
      VALUES ('${a.id}', '${DEMO_BUSINESS_ID}', '${a.type}', '${a.priority}', '${a.title}', '${a.desc}', '${a.mod}', 0)
    `);
  }

  // 8. Baseline Decision History record
  db.run(`
    INSERT INTO decisions (id, business_id, date, title, scenario_type, reason, target_product, parameters, simulated_effect, actual_effect, status)
    VALUES (
      'dec_prev_1',
      '${DEMO_BUSINESS_ID}',
      '2026-08-15',
      'Adjusted Smart Watch price from ₹2,799 to ₹2,999',
      'price',
      'Capture premium wearable margin while demand remained price inelastic.',
      'Smart Watch',
      '{"currentPrice":2799,"newPrice":2999}',
      '{"revenueImpact":8800,"profitImpact":8800,"demandImpactPercent":-2.1,"summary":"Projected +₹8,800 monthly profit with minor 2% volume contraction."}',
      '{"revenueImpact":9200,"profitImpact":9200,"statusSummary":"Exceeded simulation: demand held steady at 46 units."}',
      'IMPLEMENTED'
    )
  `);

  persistDb();
  console.log('UrbanKart Retail demo dataset seeded successfully!');
}
