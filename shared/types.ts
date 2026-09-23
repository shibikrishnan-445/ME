// Shared TypeScript types for SME SAGE Platform

export type BusinessType = 
  | 'Retail'
  | 'Manufacturing'
  | 'Food & Beverage'
  | 'Services'
  | 'E-commerce'
  | 'Other';

export interface Business {
  id: string;
  name: string;
  businessType: BusinessType;
  employees: number;
  monthlyRevenueRange: string;
  primaryProducts: string[];
  location: string;
  currency: string;
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SaleRecord {
  id: string;
  businessId: string;
  date: string;
  product: string;
  category: string;
  quantity: number;
  unitPrice: number;
  revenue: number;
  unitCost: number;
  profit: number;
  customerId: string;
}

export interface ExpenseRecord {
  id: string;
  businessId: string;
  date: string;
  category: string;
  amount: number;
  description: string;
}

export type InventoryStatus = 'LOW STOCK' | 'HEALTHY' | 'OVERSTOCK' | 'SLOW MOVING' | 'DEAD STOCK';

export interface InventoryItem {
  id: string;
  businessId: string;
  product: string;
  category: string;
  stock: number;
  reorderLevel: number;
  unitCost: number;
  sellingPrice: number;
  supplier: string;
  avgMonthlySales: number;
  stockCoverageMonths: number;
  status: InventoryStatus;
  aiExplanation: string;
  lastUpdated: string;
}

export type CustomerSegment = 'HIGH VALUE' | 'REGULAR' | 'OCCASIONAL' | 'AT RISK';

export interface CustomerRecord {
  id: string;
  businessId: string;
  customerId: string;
  name: string;
  location: string;
  purchaseCount: number;
  totalSpend: number;
  lastPurchaseDate: string;
  segment: CustomerSegment;
  daysSinceLastPurchase: number;
}

export interface HealthScoreComponents {
  revenueGrowth: number;       // 0-100
  profitability: number;       // 0-100
  inventoryHealth: number;     // 0-100
  customerRetention: number;   // 0-100
  expenseControl: number;      // 0-100
}

export interface BusinessHealthScore {
  overallScore: number;        // 0-100
  statusText: string;          // e.g. "Business health is stable, but inventory efficiency requires attention."
  components: HealthScoreComponents;
  explanations: Record<keyof HealthScoreComponents, string>;
}

export interface KPICardData {
  title: string;
  value: number;
  displayValue: string;
  trendPercentage: number;
  isPositive: boolean;
  prefix?: string;
  suffix?: string;
  periodText: string;
}

export interface DashboardSummary {
  business: Business;
  healthScore: BusinessHealthScore;
  kpis: {
    totalRevenue: KPICardData;
    totalExpense: KPICardData;
    netProfit: KPICardData;
    profitMargin: KPICardData;
    inventoryValue: KPICardData;
    totalCustomers: KPICardData;
  };
  revenueTrend: { month: string; revenue: number; expense: number; profit: number }[];
  topProducts: { product: string; revenue: number; units: number; margin: number }[];
  bottomProducts: { product: string; revenue: number; units: number; margin: number }[];
  criticalAlertCount: number;
  warningAlertCount: number;
  activeInsightsCount: number;
  lastUpdated: string;
  isDemoMode: boolean;
}

export type InsightCategory = 
  | 'Revenue Drop'
  | 'Revenue Growth'
  | 'Inventory Risk'
  | 'Expense Spike'
  | 'Profit Drop'
  | 'Customer Loss'
  | 'Positive Trend'
  | 'Unusual Activity';

export type InsightSeverity = 'critical' | 'warning' | 'positive' | 'info';

export interface AIInsight {
  id: string;
  businessId: string;
  category: InsightCategory;
  severity: InsightSeverity;
  title: string;
  problem: string;
  evidence: string;
  possibleReason: string;
  recommendedAction: string;
  simulationPreset?: {
    scenarioType: 'price' | 'discount' | 'purchase' | 'marketing' | 'expense';
    product?: string;
    suggestedChangeValue: number;
  };
  source: 'Demo Intelligence Engine' | 'External AI';
  createdAt: string;
}

export type DecisionStatus = 'SIMULATED' | 'APPROVED' | 'IMPLEMENTED' | 'REVIEWING' | 'COMPLETED';

export interface BusinessDecision {
  id: string;
  businessId: string;
  date: string;
  title: string;
  scenarioType: string;
  reason: string;
  targetProduct?: string;
  parameters: Record<string, any>;
  simulatedEffect: {
    revenueImpact: number;
    profitImpact: number;
    demandImpactPercent: number;
    summary: string;
  };
  actualEffect?: {
    revenueImpact: number;
    profitImpact: number;
    statusSummary: string;
  };
  status: DecisionStatus;
  createdAt: string;
  updatedAt: string;
}

export type AlertPriority = 'CRITICAL' | 'WARNING' | 'POSITIVE';
export type AlertType = 
  | 'LOW STOCK'
  | 'OVERSTOCK'
  | 'REVENUE DROP'
  | 'EXPENSE SPIKE'
  | 'PROFIT DROP'
  | 'SALES GROWTH'
  | 'CUSTOMER LOSS';

export interface SmartAlert {
  id: string;
  businessId: string;
  type: AlertType;
  priority: AlertPriority;
  title: string;
  description: string;
  targetModule: 'inventory' | 'analytics' | 'customers' | 'simulator' | 'insights';
  isRead: boolean;
  createdAt: string;
}

export interface WhatIfScenarioInput {
  scenarioType: 'price' | 'discount' | 'purchase' | 'marketing' | 'expense';
  product?: string;
  currentPrice?: number;
  newPrice?: number;
  currentDiscountPercent?: number;
  newDiscountPercent?: number;
  currentPurchaseQty?: number;
  newPurchaseQty?: number;
  marketingBudgetDelta?: number;
  expenseReductionPercent?: number;
  expenseCategory?: string;
}

export interface SimulationResult {
  scenarioType: string;
  targetProduct?: string;
  baseline: {
    price: number;
    demand: number;
    revenue: number;
    cost: number;
    profit: number;
    marginPercent: number;
    inventory?: number;
  };
  projected: {
    price: number;
    demand: number;
    revenue: number;
    cost: number;
    profit: number;
    marginPercent: number;
    inventory?: number;
  };
  impact: {
    demandChangePercent: number;
    revenueDiff: number;
    revenueChangePercent: number;
    profitDiff: number;
    profitChangePercent: number;
    workingCapitalImpact?: number;
    inventoryDiff?: number;
  };
  demandElasticityUsed: number;
  disclaimer: string;
  summaryExplanation: string;
}

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  supportingMetrics?: { label: string; value: string; change?: string }[];
  suggestedAction?: { text: string; actionUrl: string };
  chartData?: { name: string; value: number }[];
  chartType?: 'bar' | 'pie' | 'line';
  engineLabel: string;
}
