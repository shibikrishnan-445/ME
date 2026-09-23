import { Router, Request, Response } from 'express';
import multer from 'multer';
import { seedDemoData, DEMO_BUSINESS_ID } from '../database/seedDemoData';
import { parseAndCleanFile } from '../engines/dataCleaner';
import { queryAll, queryOne, runQuery } from '../database/db';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/demo', async (req: Request, res: Response) => {
  try {
    await seedDemoData();
    res.json({
      success: true,
      businessId: DEMO_BUSINESS_ID,
      businessName: 'UrbanKart Retail',
      message: 'UrbanKart Retail demo data loaded successfully with realistic business patterns.'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const businessId = (req.body.businessId as string) || DEMO_BUSINESS_ID;
    const category = (req.body.category as 'SALES' | 'EXPENSE' | 'INVENTORY' | 'CUSTOMER') || 'SALES';

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Please upload a CSV or Excel file.' });
    }

    const cleanResult = parseAndCleanFile(req.file.buffer, req.file.originalname, category);

    // Save cleaned records to database
    if (category === 'SALES') {
      for (const row of cleanResult.cleanedData) {
        const id = `sale_up_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        await runQuery(`
          INSERT INTO sales (id, business_id, date, product, category, quantity, unit_price, revenue, unit_cost, profit, customer_id)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [id, businessId, row.date, row.product, row.category, row.quantity, row.unit_price, row.revenue, row.unit_cost, row.profit, row.customer_id]);
      }
    } else if (category === 'EXPENSE') {
      for (const row of cleanResult.cleanedData) {
        const id = `exp_up_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        await runQuery(`
          INSERT INTO expenses (id, business_id, date, category, amount, description)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [id, businessId, row.date, row.category, row.amount, row.description]);
      }
    } else if (category === 'INVENTORY') {
      for (const row of cleanResult.cleanedData) {
        const id = `inv_up_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        await runQuery(`
          INSERT INTO inventory (id, business_id, product, category, stock, reorder_level, unit_cost, selling_price, supplier, avg_monthly_sales, stock_coverage_months, status, ai_explanation)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 30, 2.0, 'HEALTHY', 'Uploaded inventory item')
        `, [id, businessId, row.product, row.category, row.stock, row.reorder_level, row.unit_cost, row.selling_price, row.supplier]);
      }
    } else if (category === 'CUSTOMER') {
      for (const row of cleanResult.cleanedData) {
        const id = `cust_up_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        await runQuery(`
          INSERT INTO customers (id, business_id, customer_id, name, location, purchase_count, total_spend, last_purchase_date, segment, days_since_last_purchase)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [id, businessId, row.customer_id, row.name, row.location, row.purchase_count, row.total_spend, row.last_purchase_date, row.segment, row.days_since_last_purchase]);
      }
    }

    // Record upload entry
    const uploadId = `upl_${Date.now()}`;
    await runQuery(`
      INSERT INTO uploads (id, business_id, filename, upload_type, record_count, quality_score, issues_fixed, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'completed')
    `, [uploadId, businessId, req.file.originalname, category, cleanResult.cleanedData.length, cleanResult.qualityScore, cleanResult.issuesCount]);

    res.json({
      success: true,
      result: cleanResult,
      message: `Processed ${cleanResult.cleanedData.length} records. Quality Score: ${cleanResult.qualityScore}%`
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/status', async (req: Request, res: Response) => {
  try {
    const businessId = (req.query.businessId as string) || DEMO_BUSINESS_ID;

    const salesCount = (await queryOne<{ count: number }>(`SELECT COUNT(*) as count FROM sales WHERE business_id = ?`, [businessId]))?.count || 0;
    const expenseCount = (await queryOne<{ count: number }>(`SELECT COUNT(*) as count FROM expenses WHERE business_id = ?`, [businessId]))?.count || 0;
    const inventoryCount = (await queryOne<{ count: number }>(`SELECT COUNT(*) as count FROM inventory WHERE business_id = ?`, [businessId]))?.count || 0;
    const customerCount = (await queryOne<{ count: number }>(`SELECT COUNT(*) as count FROM customers WHERE business_id = ?`, [businessId]))?.count || 0;
    const recentUploads = await queryAll(`SELECT * FROM uploads WHERE business_id = ? ORDER BY created_at DESC LIMIT 5`, [businessId]);

    res.json({
      salesCount,
      expenseCount,
      inventoryCount,
      customerCount,
      recentUploads,
      isDemoMode: businessId === DEMO_BUSINESS_ID
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/clear', async (req: Request, res: Response) => {
  try {
    const businessId = (req.body.businessId as string) || DEMO_BUSINESS_ID;

    await runQuery(`DELETE FROM sales WHERE business_id = ?`, [businessId]);
    await runQuery(`DELETE FROM expenses WHERE business_id = ?`, [businessId]);
    await runQuery(`DELETE FROM inventory WHERE business_id = ?`, [businessId]);
    await runQuery(`DELETE FROM customers WHERE business_id = ?`, [businessId]);
    await runQuery(`DELETE FROM insights WHERE business_id = ?`, [businessId]);
    await runQuery(`DELETE FROM alerts WHERE business_id = ?`, [businessId]);
    await runQuery(`DELETE FROM decisions WHERE business_id = ?`, [businessId]);
    await runQuery(`DELETE FROM uploads WHERE business_id = ?`, [businessId]);

    res.json({
      success: true,
      message: 'All temporary data removed successfully! You now have a clean slate to upload your own business data.'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
