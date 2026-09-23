import { Router, Request, Response } from 'express';
import { queryOne, runQuery } from '../database/db';
import { DEMO_USER_ID, DEMO_BUSINESS_ID, seedDemoData } from '../database/seedDemoData';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await queryOne(`SELECT id, name, email, role FROM users WHERE email = ?`, [email]);
    if (!user) {
      // Mock creation for prototyping
      const newUserId = `user_${Date.now()}`;
      await runQuery(`INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)`, [
        newUserId,
        email.split('@')[0],
        email,
        'mock_hash',
        'owner'
      ]);
      return res.json({
        user: { id: newUserId, name: email.split('@')[0], email, role: 'owner' },
        token: `mock_jwt_${newUserId}`
      });
    }

    res.json({
      user,
      token: `mock_jwt_${user.id}`
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !name) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const newUserId = `user_${Date.now()}`;
    await runQuery(`INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)`, [
      newUserId,
      name,
      email,
      'mock_hash',
      'owner'
    ]);

    res.json({
      user: { id: newUserId, name, email, role: 'owner' },
      token: `mock_jwt_${newUserId}`
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/demo', async (req: Request, res: Response) => {
  try {
    // Seed demo data ensuring UrbanKart Retail is populated
    await seedDemoData();
    const demoUser = await queryOne(`SELECT id, name, email, role FROM users WHERE id = ?`, [DEMO_USER_ID]);
    res.json({
      user: demoUser,
      businessId: DEMO_BUSINESS_ID,
      token: `mock_demo_token_${DEMO_USER_ID}`,
      isDemo: true
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
