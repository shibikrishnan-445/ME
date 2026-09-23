import { WhatIfScenarioInput, SimulationResult } from '../../../shared/types';
import { queryOne } from '../database/db';

export async function runSimulation(businessId: string, input: WhatIfScenarioInput): Promise<SimulationResult> {
  const disclaimer = 'SIMULATED PROJECTION: Projection based on historical/demo data. Actual results may differ.';

  // Default baseline fallback if product query not matched
  let price = 2499;
  let cost = 1500;
  let demand = 64; // current monthly demand
  let inventory = 420;

  if (input.product) {
    const inv = await queryOne<{
      selling_price: number;
      unit_cost: number;
      avg_monthly_sales: number;
      stock: number;
    }>(`SELECT selling_price, unit_cost, avg_monthly_sales, stock FROM inventory WHERE business_id = ? AND product = ?`, [businessId, input.product]);

    if (inv) {
      price = inv.selling_price;
      cost = inv.unit_cost;
      demand = Math.round(inv.avg_monthly_sales);
      inventory = inv.stock;
    }
  }

  // Base calculations
  const baseRevenue = demand * price;
  const baseCost = demand * cost;
  const baseProfit = baseRevenue - baseCost;
  const baseMarginPercent = (baseProfit / baseRevenue) * 100;

  let projPrice = price;
  let projDemand = demand;
  let projCost = cost;
  let workingCapitalImpact = 0;
  let inventoryDiff = 0;
  let elasticity = 1.15; // Realistic price elasticity for electronics
  let explanation = '';

  switch (input.scenarioType) {
    case 'price': {
      projPrice = input.newPrice && input.newPrice > 0 ? input.newPrice : price;
      const priceChangeRatio = (projPrice - price) / price;
      // Demand decreases if price increases, increases if price decreases
      const demandChangeRatio = -elasticity * priceChangeRatio;
      projDemand = Math.max(1, Math.round(demand * (1 + demandChangeRatio)));
      
      const priceDiff = projPrice - price;
      const diffSign = priceDiff > 0 ? '+' : '';
      explanation = `Adjusting price from ₹${price.toLocaleString('en-IN')} to ₹${projPrice.toLocaleString('en-IN')} (${diffSign}${Math.round(priceChangeRatio * 100)}%) is projected to change unit demand by ${Math.round(demandChangeRatio * 100)}% based on historical category elasticity of ${elasticity}.`;
      break;
    }

    case 'discount': {
      const disc = input.newDiscountPercent || 0;
      projPrice = Math.round(price * (1 - (disc / 100)));
      const discountImpact = (disc / 100) * 1.35; // discount promotional lift
      projDemand = Math.round(demand * (1 + discountImpact));
      explanation = `Introducing a ${disc}% promotional discount drops effective unit price to ₹${projPrice.toLocaleString('en-IN')} while lifting unit sales volume by +${Math.round(discountImpact * 100)}%.`;
      break;
    }

    case 'purchase': {
      const curPurchase = input.currentPurchaseQty || 100;
      const newPurchase = input.newPurchaseQty !== undefined ? input.newPurchaseQty : 50;
      const qtyDiff = newPurchase - curPurchase;
      workingCapitalImpact = qtyDiff * cost; // negative means cash freed up!
      inventoryDiff = qtyDiff;
      projPrice = price;
      projDemand = demand;
      
      const cashText = workingCapitalImpact < 0 
        ? `frees up ₹${Math.abs(workingCapitalImpact).toLocaleString('en-IN')} in liquid working capital`
        : `requires ₹${workingCapitalImpact.toLocaleString('en-IN')} additional capital`;
      explanation = `Reducing replenishment order from ${curPurchase} to ${newPurchase} units ${cashText} and avoids deepening overstock inventory holding costs.`;
      break;
    }

    case 'expense': {
      const reductionPct = input.expenseReductionPercent || 15;
      const category = input.expenseCategory || 'Logistics';
      projPrice = price;
      projDemand = demand;
      // For expense reduction, simulate monthly savings on logistics
      const currentCategoryExp = category === 'Logistics' ? 63000 : 50000;
      const savedAmount = Math.round(currentCategoryExp * (reductionPct / 100));
      explanation = `A ${reductionPct}% operational reduction in ${category} expenses yields ₹${savedAmount.toLocaleString('en-IN')} in direct monthly bottom-line savings.`;
      break;
    }

    case 'marketing': {
      const budgetDelta = input.marketingBudgetDelta || 10000;
      const estimatedCAC = 450; // Customer Acquisition Cost ₹450
      const extraOrders = Math.round(budgetDelta / estimatedCAC);
      projPrice = price;
      projDemand = demand + extraOrders;
      explanation = `An additional ₹${budgetDelta.toLocaleString('en-IN')} marketing spend with an estimated CAC of ₹${estimatedCAC} is projected to generate +${extraOrders} incremental units.`;
      break;
    }

    default:
      explanation = 'Standard baseline simulation applied.';
  }

  const projRevenue = projDemand * projPrice;
  const projTotalCost = projDemand * projCost;
  const projProfit = projRevenue - projTotalCost;
  const projMarginPercent = projRevenue > 0 ? (projProfit / projRevenue) * 100 : 0;

  const revenueDiff = projRevenue - baseRevenue;
  const profitDiff = projProfit - baseProfit;
  const demandChangePercent = demand > 0 ? ((projDemand - demand) / demand) * 100 : 0;
  const revenueChangePercent = baseRevenue > 0 ? (revenueDiff / baseRevenue) * 100 : 0;
  const profitChangePercent = baseProfit > 0 ? (profitDiff / baseProfit) * 100 : 0;

  return {
    scenarioType: input.scenarioType,
    targetProduct: input.product,
    baseline: {
      price,
      demand,
      revenue: baseRevenue,
      cost: baseCost,
      profit: baseProfit,
      marginPercent: Math.round(baseMarginPercent * 10) / 10,
      inventory
    },
    projected: {
      price: projPrice,
      demand: projDemand,
      revenue: projRevenue,
      cost: projTotalCost,
      profit: projProfit,
      marginPercent: Math.round(projMarginPercent * 10) / 10,
      inventory: inventory + inventoryDiff
    },
    impact: {
      demandChangePercent: Math.round(demandChangePercent * 10) / 10,
      revenueDiff,
      revenueChangePercent: Math.round(revenueChangePercent * 10) / 10,
      profitDiff,
      profitChangePercent: Math.round(profitChangePercent * 10) / 10,
      workingCapitalImpact,
      inventoryDiff
    },
    demandElasticityUsed: elasticity,
    disclaimer,
    summaryExplanation: explanation
  };
}
