import { Router, Request, Response } from 'express';
import { queryAll, queryOne, runQuery } from '../database/db';
import { DEMO_BUSINESS_ID } from '../database/seedDemoData';
import { BusinessDecision } from '../../../shared/types';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const businessId = (req.query.businessId as string) || DEMO_BUSINESS_ID;

    const rows = await queryAll<{
      id: string;
      business_id: string;
      date: string;
      title: string;
      scenario_type: string;
      reason: string;
      target_product: string;
      parameters: string;
      simulated_effect: string;
      actual_effect: string;
      status: string;
      created_at: string;
      updated_at: string;
    }>(`SELECT * FROM decisions WHERE business_id = ? ORDER BY date DESC, created_at DESC`, [businessId]);

    const decisions: BusinessDecision[] = rows.map(r => ({
      id: r.id,
      businessId: r.business_id,
      date: r.date,
      title: r.title,
      scenarioType: r.scenario_type,
      reason: r.reason,
      targetProduct: r.target_product || undefined,
      parameters: r.parameters ? JSON.parse(r.parameters) : {},
      simulatedEffect: r.simulated_effect ? JSON.parse(r.simulated_effect) : { revenueImpact: 0, profitImpact: 0, demandImpactPercent: 0, summary: '' },
      actualEffect: r.actual_effect ? JSON.parse(r.actual_effect) : undefined,
      status: r.status as any,
      createdAt: r.created_at,
      updatedAt: r.updated_at
    }));

    res.json({ decisions });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      businessId,
      title,
      scenarioType,
      reason,
      targetProduct,
      parameters,
      simulatedEffect,
      status
    } = req.body;

    const bId = businessId || DEMO_BUSINESS_ID;
    const id = `dec_${Date.now()}`;
    const dateStr = new Date().toISOString().split('T')[0];

    await runQuery(`
      INSERT INTO decisions (id, business_id, date, title, scenario_type, reason, target_product, parameters, simulated_effect, actual_effect, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      bId,
      dateStr,
      title || 'Operational Business Decision',
      scenarioType || 'price',
      reason || 'Decision simulated in SME SAGE Decision Lab',
      targetProduct || null,
      JSON.stringify(parameters || {}),
      JSON.stringify(simulatedEffect || {}),
      JSON.stringify({ revenueImpact: simulatedEffect?.revenueImpact || 0, profitImpact: simulatedEffect?.profitImpact || 0, statusSummary: 'Under active tracking against current period sales' }),
      status || 'APPROVED'
    ]);

    const saved = await queryOne(`SELECT * FROM decisions WHERE id = ?`, [id]);
    res.json({
      success: true,
      decision: saved,
      message: 'Decision saved successfully to Decision History timeline.'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await runQuery(`UPDATE decisions SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [status, id]);
    res.json({ success: true, message: `Decision status updated to ${status}` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
