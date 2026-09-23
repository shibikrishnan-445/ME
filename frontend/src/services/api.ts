import {
  DashboardSummary,
  AIInsight,
  SmartAlert,
  InventoryItem,
  CustomerRecord,
  BusinessDecision,
  WhatIfScenarioInput,
  SimulationResult,
  AssistantMessage
} from '../types';

const BASE_URL = '/api';

export async function fetchDashboard(businessId?: string): Promise<DashboardSummary> {
  const url = businessId ? `${BASE_URL}/dashboard?businessId=${businessId}` : `${BASE_URL}/dashboard`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load dashboard data');
  return res.json();
}

export async function loadDemoSME(): Promise<{ success: boolean; businessId: string; message: string }> {
  const res = await fetch(`${BASE_URL}/data/demo`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to load demo SME');
  return res.json();
}

export async function clearAllData(businessId?: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${BASE_URL}/data/clear`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ businessId })
  });
  if (!res.ok) throw new Error('Failed to clear business data');
  return res.json();
}

export async function uploadData(formData: FormData): Promise<any> {
  const res = await fetch(`${BASE_URL}/data/upload`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Upload failed');
  }
  return res.json();
}

export async function fetchAnalyticsSales(period = '6M'): Promise<any> {
  const res = await fetch(`${BASE_URL}/analytics/sales?period=${period}`);
  if (!res.ok) throw new Error('Failed to load sales analytics');
  return res.json();
}

export async function fetchAnalyticsExpenses(): Promise<any> {
  const res = await fetch(`${BASE_URL}/analytics/expenses`);
  if (!res.ok) throw new Error('Failed to load expense analytics');
  return res.json();
}

export async function fetchAnalyticsProfitability(): Promise<any> {
  const res = await fetch(`${BASE_URL}/analytics/profitability`);
  if (!res.ok) throw new Error('Failed to load profitability analytics');
  return res.json();
}

export async function fetchInventory(): Promise<{ summary: any; items: InventoryItem[] }> {
  const res = await fetch(`${BASE_URL}/inventory`);
  if (!res.ok) throw new Error('Failed to load inventory intelligence');
  return res.json();
}

export async function reorderInventory(productId: string, reorderQuantity: number): Promise<any> {
  const res = await fetch(`${BASE_URL}/inventory/reorder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, reorderQuantity })
  });
  if (!res.ok) throw new Error('Failed to process reorder');
  return res.json();
}

export async function fetchCustomers(): Promise<{ summary: any; customers: CustomerRecord[] }> {
  const res = await fetch(`${BASE_URL}/customers`);
  if (!res.ok) throw new Error('Failed to load customers');
  return res.json();
}

export async function fetchInsights(): Promise<{ insights: AIInsight[] }> {
  const res = await fetch(`${BASE_URL}/insights`);
  if (!res.ok) throw new Error('Failed to load insights');
  return res.json();
}

export async function runSimulation(input: WhatIfScenarioInput): Promise<SimulationResult> {
  const res = await fetch(`${BASE_URL}/simulator`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });
  if (!res.ok) throw new Error('Failed to run simulation');
  const data = await res.json();
  return data.simulation;
}

export async function fetchDecisions(): Promise<{ decisions: BusinessDecision[] }> {
  const res = await fetch(`${BASE_URL}/decisions`);
  if (!res.ok) throw new Error('Failed to load decisions timeline');
  return res.json();
}

export async function saveDecision(decisionData: any): Promise<any> {
  const res = await fetch(`${BASE_URL}/decisions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(decisionData)
  });
  if (!res.ok) throw new Error('Failed to save decision');
  return res.json();
}

export async function updateDecisionStatus(id: string, status: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/decisions/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update status');
  return res.json();
}

export async function askAssistant(query: string): Promise<AssistantMessage> {
  const res = await fetch(`${BASE_URL}/ai/assistant`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  if (!res.ok) throw new Error('Failed to query assistant');
  return res.json();
}

export async function fetchAlerts(): Promise<{ alerts: SmartAlert[] }> {
  const res = await fetch(`${BASE_URL}/alerts`);
  if (!res.ok) throw new Error('Failed to load alerts');
  return res.json();
}

export async function markAlertRead(id: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/alerts/${id}/read`, {
    method: 'PATCH'
  });
  if (!res.ok) throw new Error('Failed to mark alert as read');
  return res.json();
}

export async function generateReport(): Promise<any> {
  const res = await fetch(`${BASE_URL}/reports/generate`);
  if (!res.ok) throw new Error('Failed to generate report');
  return res.json();
}

export async function loginDemo(): Promise<any> {
  const res = await fetch(`${BASE_URL}/auth/demo`, { method: 'POST' });
  if (!res.ok) throw new Error('Demo login failed');
  return res.json();
}

export async function loginUser(email: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}
