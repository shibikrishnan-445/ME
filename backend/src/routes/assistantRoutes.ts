import { Router, Request, Response } from 'express';
import { processAssistantQuery } from '../engines/assistantEngine';
import { DEMO_BUSINESS_ID } from '../database/seedDemoData';
import { queryAll } from '../database/db';

const router = Router();

router.post('/assistant', async (req: Request, res: Response) => {
  try {
    const businessId = (req.body.businessId as string) || DEMO_BUSINESS_ID;
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const response = await processAssistantQuery(businessId, query);
    res.json(response);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const businessId = (req.body.businessId as string) || DEMO_BUSINESS_ID;
    const insights = await queryAll(`SELECT * FROM insights WHERE business_id = ?`, [businessId]);
    res.json({
      success: true,
      analysis: 'Comprehensive business diagnostics generated from live transactions.',
      insightsCount: insights.length,
      engine: 'Demo Intelligence Engine'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/recommend', async (req: Request, res: Response) => {
  try {
    const businessId = (req.body.businessId as string) || DEMO_BUSINESS_ID;
    res.json({
      success: true,
      recommendations: [
        'Place emergency purchase order for 80 Power Banks to prevent stockout in 9 days.',
        'Run 10% promotional bundle on Mechanical Keyboard to unlock ₹1,80,000 tied up in overstock.',
        'Renegotiate carrier rush-shipping rates to eliminate the 21% logistics surge.'
      ],
      engine: 'Demo Intelligence Engine'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
