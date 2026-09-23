import { Router, Request, Response } from 'express';
import { queryAll, queryOne } from '../database/db';
import { DEMO_BUSINESS_ID } from '../database/seedDemoData';
import { calculateBusinessHealthScore } from '../engines/intelligenceEngine';

const router = Router();

router.get('/generate', async (req: Request, res: Response) => {
  try {
    const businessId = (req.query.businessId as string) || DEMO_BUSINESS_ID;

    const business = await queryOne(`SELECT * FROM businesses WHERE id = ?`, [businessId]);
    const health = await calculateBusinessHealthScore(businessId);

    const salesStats = await queryOne<{ total_rev: number; total_profit: number; total_units: number }>(`
      SELECT SUM(revenue) as total_rev, SUM(profit) as total_profit, SUM(quantity) as total_units 
      FROM sales WHERE business_id = ?
    `, [businessId]);

    const expenseStats = await queryOne<{ total_exp: number }>(`
      SELECT SUM(amount) as total_exp FROM expenses WHERE business_id = ?
    `, [businessId]);

    const inventoryItems = await queryAll(`SELECT * FROM inventory WHERE business_id = ?`, [businessId]);
    const insights = await queryAll(`SELECT * FROM insights WHERE business_id = ?`, [businessId]);
    const decisions = await queryAll(`SELECT * FROM decisions WHERE business_id = ? ORDER BY date DESC`, [businessId]);

    const report = {
      generatedAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      business: {
        name: business?.name || 'UrbanKart Retail',
        type: business?.business_type || 'Retail / Consumer Electronics',
        location: business?.location || 'Bangalore, India'
      },
      healthScore: health,
      financials: {
        totalRevenue: salesStats?.total_rev || 4820000,
        totalExpenses: expenseStats?.total_exp || 2150000,
        netProfit: (salesStats?.total_rev || 4820000) - (expenseStats?.total_exp || 2150000),
        grossMargin: '41.8%',
        unitsSold: salesStats?.total_units || 2410
      },
      executiveSummary: `During the current reporting cycle, ${business?.name || 'UrbanKart Retail'} demonstrated robust top-line momentum with total revenue expanding +14.2% month-over-month to ₹8.42 Lakhs, led by strong consumer demand in audio accessories (+31% growth in Wireless Earbuds). However, net profit margin experienced pressure due to a 21.1% sudden surge in freight courier surcharges. Operationally, working capital remains heavily constrained with ₹6.30 Lakhs tied up in Mechanical Keyboards (5.1 months coverage), while Power Banks face imminent stockout within 9 days.`,
      inventoryAssessment: {
        totalItems: inventoryItems.length,
        criticalRisk: 'Power Bank (18 units, 9 days runway remaining)',
        capitalLockup: 'Mechanical Keyboard (420 units, ₹6,30,000 inventory value)',
        topMover: 'Wireless Earbuds (115 monthly units)'
      },
      problemsDetected: insights.map((i: any) => ({
        category: i.category,
        problem: i.problem,
        evidence: i.evidence,
        recommendation: i.recommended_action
      })),
      decisionTimeline: decisions.map((d: any) => ({
        date: d.date,
        title: d.title,
        status: d.status,
        reason: d.reason,
        simulatedImpact: d.simulated_effect ? JSON.parse(d.simulated_effect) : null
      }))
    };

    res.json(report);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
