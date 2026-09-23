import { Router, Request, Response } from 'express';
import { queryAll, runQuery } from '../database/db';
import { DEMO_BUSINESS_ID } from '../database/seedDemoData';
import { SmartAlert } from '../../../shared/types';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const businessId = (req.query.businessId as string) || DEMO_BUSINESS_ID;

    const rows = await queryAll<{
      id: string;
      business_id: string;
      type: string;
      priority: string;
      title: string;
      description: string;
      target_module: string;
      is_read: number;
      created_at: string;
    }>(`SELECT * FROM alerts WHERE business_id = ? ORDER BY priority = 'CRITICAL' DESC, created_at DESC`, [businessId]);

    const alerts: SmartAlert[] = rows.map(r => ({
      id: r.id,
      businessId: r.business_id,
      type: r.type as any,
      priority: r.priority as any,
      title: r.title,
      description: r.description,
      targetModule: (r.target_module as any) || 'dashboard',
      isRead: Boolean(r.is_read),
      createdAt: r.created_at
    }));

    res.json({ alerts });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/read', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await runQuery(`UPDATE alerts SET is_read = 1 WHERE id = ?`, [id]);
    res.json({ success: true, message: 'Alert marked as read' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
