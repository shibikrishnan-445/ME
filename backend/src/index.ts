import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import authRoutes from './routes/authRoutes';
import businessRoutes from './routes/businessRoutes';
import dataRoutes from './routes/dataRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import inventoryRoutes from './routes/inventoryRoutes';
import customerRoutes from './routes/customerRoutes';
import insightsRoutes from './routes/insightsRoutes';
import simulatorRoutes from './routes/simulatorRoutes';
import decisionsRoutes from './routes/decisionsRoutes';
import assistantRoutes from './routes/assistantRoutes';
import alertsRoutes from './routes/alertsRoutes';
import reportsRoutes from './routes/reportsRoutes';

import { getDb } from './database/db';
import { seedDemoData, DEMO_BUSINESS_ID } from './database/seedDemoData';
import { queryOne } from './database/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    platform: 'SME SAGE Decision Intelligence Platform',
    timestamp: new Date().toISOString()
  });
});

// Route registration
app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/simulator', simulatorRoutes);
app.use('/api/decisions', decisionsRoutes);
app.use('/api/ai', assistantRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/reports', reportsRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
});

// Initialize database & start server
async function startServer() {
  try {
    await getDb();
    console.log('SQLite Database Initialized.');

    // Auto-seed demo data disabled to keep clean database when wiped by user.
    // Demo dataset is only loaded when user explicitly clicks "LOAD DEMO SME".

    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`  SME SAGE - AI Business Decision Copilot Backend`);
      console.log(`  Server running on http://localhost:${PORT}`);
      console.log(`  AI Provider: ${process.env.AI_PROVIDER || 'local (Demo Intelligence Engine)'}`);
      console.log(`=======================================================`);
    });
  } catch (err) {
    console.error('Failed to start SME SAGE server:', err);
    process.exit(1);
  }
}

startServer();
