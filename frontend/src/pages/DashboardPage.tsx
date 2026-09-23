import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Package,
  Users,
  Percent,
  PlusCircle,
  BarChart2,
  Lightbulb,
  Calculator,
  Bot,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Clock
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

import { useBusiness } from '../context/BusinessContext';
import { fetchDashboard, fetchInsights, fetchAlerts } from '../services/api';
import { DashboardSummary, AIInsight, SmartAlert } from '../types';
import { StatCard } from '../components/common/StatCard';
import { HealthScoreGauge } from '../components/common/HealthScoreGauge';
import { Badge } from '../components/common/Badge';

export const DashboardPage: React.FC = () => {
  const { businessId, refreshKey, setActiveTab, setSimulatorPreset } = useBusiness();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [alerts, setAlerts] = useState<SmartAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const [dashData, insightsData, alertsData] = await Promise.all([
          fetchDashboard(businessId),
          fetchInsights(),
          fetchAlerts()
        ]);
        if (isMounted) {
          setData(dashData);
          setInsights(insightsData.insights.slice(0, 3));
          setAlerts(alertsData.alerts.slice(0, 3));
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to load dashboard data');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [businessId, refreshKey]);

  if (loading) {
    return (
      <div className="p-6 sm:p-8 space-y-6 animate-pulse">
        <div className="h-10 bg-slate-900 rounded-xl w-72" />
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-900 rounded-2xl" />
          ))}
        </div>
        <div className="h-44 bg-slate-900 rounded-2xl" />
        <div className="h-80 bg-slate-900 rounded-2xl" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center bg-slate-900/50 border border-slate-800 rounded-3xl m-6">
        <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white">Error loading dashboard</h3>
        <p className="text-xs text-slate-400 mt-1">{error || 'No business data available'}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-xl"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { kpis, healthScore, revenueTrend, topProducts, bottomProducts } = data;

  const handleSimulateInsight = (insight: AIInsight) => {
    if (insight.simulationPreset) {
      setSimulatorPreset(insight.simulationPreset as any);
    }
    setActiveTab('simulator');
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Good morning, Rajesh
            </h1>
            <span className="text-xl">👋</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Here's what is happening in <strong className="text-slate-200">UrbanKart Retail</strong> today.
          </p>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('data')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>+ Upload Data</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-all shadow-sm"
          >
            <BarChart2 className="w-4 h-4 text-blue-400" />
            <span>Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-all shadow-sm"
          >
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Insights</span>
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-bold text-emerald-300 transition-all shadow-sm"
          >
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span>Simulate Decision</span>
          </button>
          <button
            onClick={() => setActiveTab('assistant')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-xs font-bold text-indigo-300 transition-all shadow-sm"
          >
            <Bot className="w-4 h-4 text-indigo-400" />
            <span>Ask AI</span>
          </button>
        </div>
      </div>

      {/* Top Calculated KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <StatCard kpi={kpis.totalRevenue} icon={<DollarSign className="w-4 h-4 text-emerald-400" />} />
        <StatCard kpi={kpis.totalExpense} icon={<TrendingDown className="w-4 h-4 text-rose-400" />} />
        <StatCard kpi={kpis.netProfit} icon={<TrendingUp className="w-4 h-4 text-emerald-400" />} />
        <StatCard kpi={kpis.profitMargin} icon={<Percent className="w-4 h-4 text-indigo-400" />} />
        <StatCard kpi={kpis.inventoryValue} icon={<Package className="w-4 h-4 text-amber-400" />} />
        <StatCard kpi={kpis.totalCustomers} icon={<Users className="w-4 h-4 text-blue-400" />} />
      </div>

      {/* Business Health Score Banner */}
      <HealthScoreGauge healthScore={healthScore} />

      {/* Main Charts & Rankings Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Revenue & Profit Trend Chart */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Revenue & Expense Trend</h3>
              <p className="text-xs text-slate-400">Historical performance over the past 6 months (Apr - Sep 2026)</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Revenue
              </span>
              <span className="flex items-center gap-1.5 text-rose-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Expense
              </span>
              <span className="flex items-center gap-1.5 text-cyan-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Net Profit
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis
                  stroke="#64748b"
                  tick={{ fontSize: 11 }}
                  tickFormatter={val => `₹${(val / 100000).toFixed(1)}L`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`, '']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
                <Area type="monotone" dataKey="profit" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Col: Top & Bottom Products */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white tracking-tight">Product Velocity</h3>
              <button
                onClick={() => setActiveTab('analytics')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                View all
              </button>
            </div>

            {/* Top Products */}
            <div className="space-y-3 mb-5">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Top Performers (Recent Period)
              </span>
              {topProducts.map((p, idx) => (
                <div key={p.product} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-400 font-mono font-bold flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-200">{p.product}</p>
                      <p className="text-[10px] text-slate-400">{p.units} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-100">₹{(p.revenue / 1000).toFixed(0)}k</p>
                    <p className="text-[10px] text-emerald-400">{p.margin}% margin</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Products */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5" /> Slower Moving Items
              </span>
              {bottomProducts.map(p => (
                <div key={p.product} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-950/40 border border-slate-800/50">
                  <span className="font-medium text-slate-300">{p.product}</span>
                  <span className="font-mono text-slate-400">₹{(p.revenue / 1000).toFixed(0)}k ({p.units} units)</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('inventory')}
            className="w-full mt-4 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Inspect Inventory Stock Coverage</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* AI Insights & Problem Diagnosis Preview */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 shadow-card">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">AI Insights & Root Causes</h3>
              <p className="text-xs text-slate-400">Deterministic diagnostics and actionable simulation hooks</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('insights')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
          >
            <span>View all 5 insights</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.map(item => (
            <div
              key={item.id}
              className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge label={item.category} />
                  <span className="text-[10px] text-slate-400 font-mono">Demo Engine</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-300 mb-2 leading-relaxed font-medium">
                  {item.problem}
                </p>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/60 mb-3 text-[11px] text-slate-400 leading-snug">
                  <strong className="text-slate-200">Root Cause:</strong> {item.possibleReason}
                </div>
              </div>

              <button
                onClick={() => handleSimulateInsight(item)}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>SIMULATE THIS ACTION</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Alerts Banner Preview */}
      {alerts.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Operational Alert</span>
                <span className="text-[10px] text-slate-400">Action Required</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 font-semibold mt-0.5">
                {alerts[0].title}: <span className="font-normal text-slate-400">{alerts[0].description}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab(alerts[0].targetModule as any)}
            className="shrink-0 text-xs font-bold text-slate-300 hover:text-white px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1"
          >
            <span>Resolve</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
