import { Router, Request, Response } from 'express';
import { queryOne, runQuery } from '../database/db';
import { DEMO_BUSINESS_ID, seedDemoData } from '../database/seedDemoData';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const businessId = (req.query.businessId as string) || DEMO_BUSINESS_ID;
    let business = await queryOne(`SELECT * FROM businesses WHERE id = ?`, [businessId]);
    if (!business) {
      // If none found, auto-seed demo
      await seedDemoData();
      business = await queryOne(`SELECT * FROM businesses WHERE id = ?`, [DEMO_BUSINESS_ID]);
    }

    if (business && typeof business.primary_products === 'string') {
      try {
        business.primaryProducts = JSON.parse(business.primary_products);
      } catch (e) {
        business.primaryProducts = [];
      }
    }

    res.json({ business });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, businessType, employees, monthlyRevenueRange, primaryProducts, location } = req.body;
    const businessId = `biz_${Date.now()}`;
    const productsJson = JSON.stringify(primaryProducts || []);

    await runQuery(`
      INSERT INTO businesses (id, name, business_type, employees, monthly_revenue_range, primary_products, location, currency, is_demo)
      VALUES (?, ?, ?, ?, ?, ?, ?, '₹', 0)
    `, [businessId, name, businessType || 'Retail', employees || 5, monthlyRevenueRange || '₹5,00,000 - ₹10,00,000', productsJson, location || 'India']);

    const created = await queryOne(`SELECT * FROM businesses WHERE id = ?`, [businessId]);
    res.json({ business: created });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/reset-demo', async (req: Request, res: Response) => {
  try {
    await seedDemoData();
    res.json({ success: true, message: 'UrbanKart Retail demo data re-seeded successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
