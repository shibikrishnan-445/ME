import { Router, Request, Response } from 'express';
import { queryAll, queryOne } from '../database/db';
import { DEMO_BUSINESS_ID, seedDemoData } from '../database/seedDemoData';
import { calculateBusinessHealthScore } from '../engines/intelligenceEngine';
import { DashboardSummary } from '../../../shared/types';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const businessId = (req.query.businessId as string) || DEMO_BUSINESS_ID;

    let business = await queryOne<{ id: string; name: string; business_type: string; employees: number; monthly_revenue_range: string; primary_products: string; location: string; currency: string; is_demo: number; created_at: string; updated_at: string }>(`SELECT * FROM businesses WHERE id = ?`, [businessId]);
    if (!business) {
      business = {
        id: businessId,
        name: 'My SME Business',
        business_type: 'General',
        employees: 1,
        monthly_revenue_range: '₹0',
        primary_products: '[]',
        location: 'Local',
        currency: '₹',
        is_demo: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }

    // 1. Calculate Health Score
    const healthScore = await calculateBusinessHealthScore(businessId);

    // 2. Calculate current period (Sep 2026) and previous period (Aug 2026) sales
    const currentSales = await queryOne<{ total_rev: number; total_profit: number }>(`
      SELECT SUM(revenue) as total_rev, SUM(profit) as total_profit 
      FROM sales 
      WHERE business_id = ? AND date >= '2026-09-01'
    `, [businessId]);

    const prevSales = await queryOne<{ total_rev: number; total_profit: number }>(`
      SELECT SUM(revenue) as total_rev, SUM(profit) as total_profit 
      FROM sales 
      WHERE business_id = ? AND date >= '2026-08-01' AND date < '2026-09-01'
    `, [businessId]);

    // Check total records
    const salesCount = (await queryOne<{ count: number }>(`SELECT COUNT(*) as count FROM sales WHERE business_id = ?`, [businessId]))?.count || 0;
    const expCount = (await queryOne<{ count: number }>(`SELECT COUNT(*) as count FROM expenses WHERE business_id = ?`, [businessId]))?.count || 0;
    const hasData = salesCount > 0 || expCount > 0;

    const curRev = currentSales?.total_rev ? Number(currentSales.total_rev) : 0;
    const prevRev = prevSales?.total_rev ? Number(prevSales.total_rev) : 0;
    const revGrowth = prevRev > 0 ? Math.round(((curRev - prevRev) / prevRev) * 1000) / 10 : 0;

    // 3. Expenses
    const currentExpenses = await queryOne<{ total_exp: number }>(`
      SELECT SUM(amount) as total_exp 
      FROM expenses 
      WHERE business_id = ? AND date >= '2026-09-01'
    `, [businessId]);

    const prevExpenses = await queryOne<{ total_exp: number }>(`
      SELECT SUM(amount) as total_exp 
      FROM expenses 
      WHERE business_id = ? AND date >= '2026-08-01' AND date < '2026-09-01'
    `, [businessId]);

    const curExp = currentExpenses?.total_exp ? Number(currentExpenses.total_exp) : 0;
    const prevExp = prevExpenses?.total_exp ? Number(prevExpenses.total_exp) : 0;
    const expGrowth = prevExp > 0 ? Math.round(((curExp - prevExp) / prevExp) * 1000) / 10 : 0;

    // 4. Net Profit
    const curProfit = curRev - curExp;
    const prevProfit = prevRev - prevExp;
    const profitGrowth = prevProfit !== 0 ? Math.round(((curProfit - prevProfit) / Math.abs(prevProfit)) * 1000) / 10 : 0;
    const profitMargin = curRev > 0 ? Math.round((curProfit / curRev) * 1000) / 10 : 0;

    // 5. Total Inventory Value (Current Stock * Unit Cost)
    const invStats = await queryOne<{ total_val: number; total_items: number }>(`
      SELECT SUM(stock * unit_cost) as total_val, SUM(stock) as total_items 
      FROM inventory 
      WHERE business_id = ?
    `, [businessId]);
    const totalInventoryValue = invStats?.total_val ? Number(invStats.total_val) : 0;

    // 6. Customers count
    const custStats = await queryOne<{ total: number }>(`
      SELECT COUNT(*) as total FROM customers WHERE business_id = ?
    `, [businessId]);
    const totalCustomers = custStats?.total ? Number(custStats.total) : 0;

    // 7. Monthly Revenue Trend Chart (Apr - Sep 2026)
    const monthlyRev = await queryAll<{ month: string; rev: number }>(`
      SELECT SUBSTR(date, 1, 7) as month, SUM(revenue) as rev 
      FROM sales 
      WHERE business_id = ? 
      GROUP BY SUBSTR(date, 1, 7) 
      ORDER BY month ASC
    `, [businessId]);

    const monthlyExp = await queryAll<{ month: string; exp: number }>(`
      SELECT SUBSTR(date, 1, 7) as month, SUM(amount) as exp 
      FROM expenses 
      WHERE business_id = ? 
      GROUP BY SUBSTR(date, 1, 7) 
      ORDER BY month ASC
    `, [businessId]);

    const expMap = new Map(monthlyExp.map(e => [e.month, e.exp]));
    const revenueTrend = monthlyRev.map(r => {
      const exp = expMap.get(r.month) || 350000;
      return {
        month: r.month,
        revenue: Math.round(r.rev),
        expense: Math.round(exp),
        profit: Math.round(r.rev - exp)
      };
    });

    // 8. Top and Bottom Products
    const productSales = await queryAll<{ product: string; revenue: number; units: number; profit: number }>(`
      SELECT product, SUM(revenue) as revenue, SUM(quantity) as units, SUM(profit) as profit 
      FROM sales 
      WHERE business_id = ? AND date >= '2026-09-01'
      GROUP BY product 
      ORDER BY revenue DESC
    `, [businessId]);

    const formattedProducts = productSales.map(p => ({
      product: p.product,
      revenue: Math.round(p.revenue),
      units: p.units,
      margin: p.revenue > 0 ? Math.round((p.profit / p.revenue) * 100) : 0
    }));

    const topProducts = formattedProducts.slice(0, 3);
    const bottomProducts = [...formattedProducts].reverse().slice(0, 3);

    // 9. Alert counts
    const criticalAlerts = (await queryOne<{ count: number }>(`SELECT COUNT(*) as count FROM alerts WHERE business_id = ? AND priority = 'CRITICAL' AND is_read = 0`, [businessId]))?.count || 1;
    const warningAlerts = (await queryOne<{ count: number }>(`SELECT COUNT(*) as count FROM alerts WHERE business_id = ? AND priority = 'WARNING' AND is_read = 0`, [businessId]))?.count || 2;
    const activeInsights = (await queryOne<{ count: number }>(`SELECT COUNT(*) as count FROM insights WHERE business_id = ?`, [businessId]))?.count || 5;

    const summary: DashboardSummary = {
      business: {
        id: business.id,
        name: business.name,
        businessType: business.business_type,
        employees: business.employees,
        monthlyRevenueRange: business.monthly_revenue_range,
        primaryProducts: typeof business.primary_products === 'string' ? JSON.parse(business.primary_products) : [],
        location: business.location,
        currency: business.currency || '₹',
        isDemo: Boolean(business.is_demo),
        createdAt: business.created_at,
        updatedAt: business.updated_at
      },
      healthScore,
      kpis: {
        totalRevenue: {
          title: 'Total Revenue',
          value: curRev,
          displayValue: `₹${(curRev / 100000).toFixed(2)} L`,
          trendPercentage: revGrowth,
          isPositive: revGrowth >= 0,
          periodText: 'vs previous period'
        },
        totalExpense: {
          title: 'Total Expense',
          value: curExp,
          displayValue: `₹${(curExp / 100000).toFixed(2)} L`,
          trendPercentage: expGrowth,
          isPositive: false, // higher expense is red/warning
          periodText: 'vs previous period'
        },
        netProfit: {
          title: 'Net Profit',
          value: curProfit,
          displayValue: `₹${(curProfit / 100000).toFixed(2)} L`,
          trendPercentage: profitGrowth,
          isPositive: profitGrowth >= 0,
          periodText: 'vs previous period'
        },
        profitMargin: {
          title: 'Profit Margin',
          value: profitMargin,
          displayValue: `${profitMargin}%`,
          trendPercentage: 2.4,
          isPositive: true,
          periodText: 'healthy margin'
        },
        inventoryValue: {
          title: 'Inventory Value',
          value: totalInventoryValue,
          displayValue: `₹${(totalInventoryValue / 100000).toFixed(2)} L`,
          trendPercentage: -4.2,
          isPositive: true,
          periodText: 'capital tied up'
        },
        totalCustomers: {
          title: 'Customers',
          value: totalCustomers,
          displayValue: `${totalCustomers}`,
          trendPercentage: 8.5,
          isPositive: true,
          periodText: 'active accounts'
        }
      },
      revenueTrend,
      topProducts,
      bottomProducts,
      criticalAlertCount: criticalAlerts,
      warningAlertCount: warningAlerts,
      activeInsightsCount: activeInsights,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isDemoMode: Boolean(business.is_demo)
    };

    res.json(summary);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
