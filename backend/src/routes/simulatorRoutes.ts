import { Router, Request, Response } from 'express';
import { runSimulation } from '../engines/simulatorEngine';
import { DEMO_BUSINESS_ID } from '../database/seedDemoData';
import { WhatIfScenarioInput } from '../../../shared/types';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const businessId = (req.body.businessId as string) || DEMO_BUSINESS_ID;
    const input: WhatIfScenarioInput = req.body;

    const result = await runSimulation(businessId, input);
    res.json({
      success: true,
      simulation: result
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
