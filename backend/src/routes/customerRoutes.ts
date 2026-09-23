import { Router, Request, Response } from 'express';
import { queryAll } from '../database/db';
import { DEMO_BUSINESS_ID } from '../database/seedDemoData';
import { CustomerRecord } from '../../../shared/types';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const businessId = (req.query.businessId as string) || DEMO_BUSINESS_ID;

    const customers = await queryAll<{
      id: string;
      business_id: string;
      customer_id: string;
      name: string;
      location: string;
      purchase_count: number;
      total_spend: number;
      last_purchase_date: string;
      segment: string;
      days_since_last_purchase: number;
    }>(`SELECT * FROM customers WHERE business_id = ? ORDER BY total_spend DESC`, [businessId]);

    const formatted: CustomerRecord[] = customers.map(c => ({
      id: c.id,
      businessId: c.business_id,
      customerId: c.customer_id,
      name: c.name,
      location: c.location,
      purchaseCount: c.purchase_count,
      totalSpend: c.total_spend,
      lastPurchaseDate: c.last_purchase_date,
      segment: c.segment as any,
      daysSinceLastPurchase: c.days_since_last_purchase
    }));

    const totalCustomers = formatted.length;
    const highValue = formatted.filter(c => c.segment === 'HIGH VALUE').length;
    const regular = formatted.filter(c => c.segment === 'REGULAR').length;
    const occasional = formatted.filter(c => c.segment === 'OCCASIONAL').length;
    const atRisk = formatted.filter(c => c.segment === 'AT RISK' || c.daysSinceLastPurchase >= 90).length;

    const totalSpend = formatted.reduce((acc, c) => acc + c.totalSpend, 0);
    const avgSpend = totalCustomers > 0 ? Math.round(totalSpend / totalCustomers) : 0;
    const retentionRate = totalCustomers > 0 ? Math.round(((totalCustomers - atRisk) / totalCustomers) * 100) : 84;

    res.json({
      summary: {
        totalCustomers,
        retentionRate,
        averageOrderValue: avgSpend,
        segments: {
          highValue,
          regular,
          occasional,
          atRisk
        },
        atRiskExplanation: `${atRisk} customers have had no purchase recorded for 90+ days and require targeted re-engagement.`
      },
      customers: formatted
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
