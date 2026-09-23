import { Router, Request, Response } from 'express';
import { queryAll } from '../database/db';
import { DEMO_BUSINESS_ID } from '../database/seedDemoData';
import { AIInsight } from '../../../shared/types';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const businessId = (req.query.businessId as string) || DEMO_BUSINESS_ID;

    const rows = await queryAll<{
      id: string;
      business_id: string;
      category: string;
      severity: string;
      title: string;
      problem: string;
      evidence: string;
      possible_reason: string;
      recommended_action: string;
      simulation_preset: string;
      source: string;
      created_at: string;
    }>(`SELECT * FROM insights WHERE business_id = ? ORDER BY created_at DESC`, [businessId]);

    const insights: AIInsight[] = rows.map(r => ({
      id: r.id,
      businessId: r.business_id,
      category: r.category as any,
      severity: r.severity as any,
      title: r.title,
      problem: r.problem,
      evidence: r.evidence,
      possibleReason: r.possible_reason,
      recommendedAction: r.recommended_action,
      simulationPreset: r.simulation_preset ? JSON.parse(r.simulation_preset) : undefined,
      source: (r.source as any) || 'Demo Intelligence Engine',
      createdAt: r.created_at
    }));

    res.json({ insights });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
