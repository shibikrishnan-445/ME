import { Router, Request, Response } from 'express';
import { queryAll, queryOne, runQuery } from '../database/db';
import { DEMO_BUSINESS_ID } from '../database/seedDemoData';
import { InventoryItem } from '../../../shared/types';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const businessId = (req.query.businessId as string) || DEMO_BUSINESS_ID;

    const items = await queryAll<{
      id: string;
      business_id: string;
      product: string;
      category: string;
      stock: number;
      reorder_level: number;
      unit_cost: number;
      selling_price: number;
      supplier: string;
      avg_monthly_sales: number;
      stock_coverage_months: number;
      status: string;
      ai_explanation: string;
      last_updated: string;
    }>(`SELECT * FROM inventory WHERE business_id = ? ORDER BY stock_coverage_months DESC`, [businessId]);

    const formattedItems: InventoryItem[] = items.map(item => {
      // Recalculate status based on dynamic formula if needed
      let status = item.status as any;
      let coverage = item.stock_coverage_months;
      if (item.avg_monthly_sales > 0) {
        coverage = Math.round((item.stock / item.avg_monthly_sales) * 10) / 10;
      }
      if (item.stock <= item.reorder_level) {
        status = 'LOW STOCK';
      } else if (coverage > 4.0) {
        status = 'OVERSTOCK';
      } else if (coverage < 1.0) {
        status = 'LOW STOCK';
      } else if (item.avg_monthly_sales < 15 && coverage > 3.0) {
        status = 'SLOW MOVING';
      } else {
        status = 'HEALTHY';
      }

      return {
        id: item.id,
        businessId: item.business_id,
        product: item.product,
        category: item.category,
        stock: item.stock,
        reorderLevel: item.reorder_level,
        unitCost: item.unit_cost,
        sellingPrice: item.selling_price,
        supplier: item.supplier,
        avgMonthlySales: item.avg_monthly_sales,
        stockCoverageMonths: coverage,
        status,
        aiExplanation: item.ai_explanation || `Current stock represents approximately ${coverage} months of expected demand.`,
        lastUpdated: item.last_updated
      };
    });

    const totalValue = formattedItems.reduce((acc, i) => acc + (i.stock * i.unitCost), 0);
    const lowStockCount = formattedItems.filter(i => i.status === 'LOW STOCK').length;
    const overstockCount = formattedItems.filter(i => i.status === 'OVERSTOCK').length;
    const slowMovingCount = formattedItems.filter(i => i.status === 'SLOW MOVING').length;
    const healthyCount = formattedItems.filter(i => i.status === 'HEALTHY').length;

    res.json({
      summary: {
        totalValue,
        totalItems: formattedItems.length,
        lowStockCount,
        overstockCount,
        slowMovingCount,
        healthyCount,
        formulaExplanation: 'Stock Coverage = Current Stock / Average Monthly Sales'
      },
      items: formattedItems
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/reorder', async (req: Request, res: Response) => {
  try {
    const { businessId, productId, reorderQuantity } = req.body;
    const bId = businessId || DEMO_BUSINESS_ID;
    const qty = Number(reorderQuantity) || 50;

    const item = await queryOne(`SELECT * FROM inventory WHERE business_id = ? AND (id = ? OR product = ?)`, [bId, productId, productId]);
    if (!item) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const newStock = item.stock + qty;
    const newCoverage = Math.round((newStock / Math.max(1, item.avg_monthly_sales)) * 10) / 10;
    const newStatus = newCoverage > 4.0 ? 'OVERSTOCK' : newCoverage < 1.0 ? 'LOW STOCK' : 'HEALTHY';

    await runQuery(`
      UPDATE inventory 
      SET stock = ?, stock_coverage_months = ?, status = ?, ai_explanation = ?
      WHERE id = ?
    `, [newStock, newCoverage, newStatus, `Reordered ${qty} units. New coverage: ${newCoverage} months.`, item.id]);

    res.json({
      success: true,
      message: `Reordered ${qty} units of ${item.product}. New stock is ${newStock} units.`
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
