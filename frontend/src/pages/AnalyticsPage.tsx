import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  PieChart as PieIcon,
  Layers,
  ArrowUpRight,
  Filter,
  Package,
  Calendar,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

import { useBusiness } from '../context/BusinessContext';
import {
  fetchAnalyticsSales,
  fetchAnalyticsExpenses,
  fetchAnalyticsProfitability
} from '../services/api';
import { Badge } from '../components/common/Badge';

export const AnalyticsPage: React.FC = () => {
  const { businessId, refreshKey } = useBusiness();
  const [activeTab, setActiveTab] = useState<'sales' | 'expenses' | 'profitability' | 'products'>('sales');
  const [period, setPeriod] = useState<string>('6M');

  const [salesData, setSalesData] = useState<any | null>(null);
  const [expensesData, setExpensesData] = useState<any | null>(null);
  const [profitData, setProfitData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function loadAnalytics() {
      try {
        setLoading(true);
        const [sales, expenses, profit] = await Promise.all([
          fetchAnalyticsSales(period),
          fetchAnalyticsExpenses(),
          fetchAnalyticsProfitability()
        ]);
        if (isMounted) {
          setSalesData(sales);
          setExpensesData(expenses);
          setProfitData(profit);
        }
      } catch (err) {
        console.error('Analytics load error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadAnalytics();
    return () => { isMounted = false; };
  }, [businessId, period, refreshKey]);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

  const periods = [
    { id: '1D', label: 'Today' },
    { id: '7D', label: '7 Days' },
    { id: '30D', label: '30 Days' },
    { id: '3M', label: '3 Months' },
    { id: '6M', label: '6 Months' },
    { id: '1Y', label: '1 Year' }
  ];

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Business Analytics</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Deep dive into sales trends, cost volatility, unit margins, and product performance.
          </p>
        </div>

        {/* Period Filter Buttons */}
        <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-2xl self-start sm:self-auto overflow-x-auto">
          {periods.map(p => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                period === p.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics Module Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'sales', label: 'Sales & Revenue', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'expenses', label: 'Expenses & Overhead', icon: <DollarSign className="w-4 h-4" /> },
          { id: 'profitability', label: 'Profitability & Margins', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'products', label: 'Product Deep-Dive', icon: <Package className="w-4 h-4" /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Dynamic Calculated Insights Bar */}
      {salesData && (
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>AI Analytical Summary:</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-slate-300">
            {activeTab === 'sales' && salesData.insights.map((ins: string, i: number) => (
              <span key={i} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {ins}
              </span>
            ))}
            {activeTab === 'expenses' && expensesData?.insights.map((ins: string, i: number) => (
              <span key={i} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> {ins}
              </span>
            ))}
            {activeTab === 'profitability' && profitData?.insights.map((ins: string, i: number) => (
              <span key={i} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> {ins}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tab 1: Sales Analytics */}
      {activeTab === 'sales' && salesData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Timeline Area Chart */}
            <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-1">Revenue Trajectory</h3>
              <p className="text-xs text-slate-400 mb-6">Aggregate sales volume mapped over the selected timeframe</p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData.timeline}>
                    <defs>
                      <linearGradient id="salesRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis
                      stroke="#64748b"
                      tick={{ fontSize: 11 }}
                      tickFormatter={val => `₹${(val / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                      formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`, 'Revenue']}
                    />
                    <Area type="monotone" dataKey="rev" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#salesRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Distribution Pie Chart */}
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white mb-1">Category Split</h3>
                <p className="text-xs text-slate-400 mb-4">Revenue breakdown across categories</p>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={salesData.byCategory}
                        dataKey="total_rev"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={4}
                      >
                        {salesData.byCategory.map((_: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                        formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`, '']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
                {salesData.byCategory.map((cat: any, i: number) => (
                  <div key={cat.category} className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      {cat.category}
                    </span>
                    <span className="font-mono text-slate-200">₹{cat.total_rev.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Expenses Analytics */}
      {activeTab === 'expenses' && expensesData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-1">Expense Breakdown by Category</h3>
            <p className="text-xs text-slate-400 mb-6">Volatile categories flagged with operational alert markers</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expensesData.byCategory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="category" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fontSize: 11 }}
                    tickFormatter={val => `₹${(val / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                    formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`, 'Amount']}
                  />
                  <Bar dataKey="total" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white mb-2">Cost Volatility Alerts</h3>
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              <span className="font-bold block mb-1">⚠️ Logistics Surge Detected (+21.1%)</span>
              Logistics surged from ₹52,000 to ₹63,000. Courier rush charges accounted for ₹11,000 above seasonal baseline.
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400">
              <span className="font-bold text-slate-200 block mb-1">Fixed Overhead Stability</span>
              Salaries (₹1,85,000) and Lease Rent (₹65,000) remained 100% compliant with operating projections.
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Profitability & Margins */}
      {activeTab === 'profitability' && profitData && (
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Product Margin Spectrum</h3>
              <p className="text-xs text-slate-400">Calculated unit profit margin percentages for each product</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge label="Highest: Mouse (56.2%)" variant="emerald" />
              <Badge label="Lowest: Keyboard (39.9%)" variant="amber" />
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profitData.products}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="product" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis
                  stroke="#64748b"
                  tick={{ fontSize: 11 }}
                  tickFormatter={val => `${val}%`}
                  domain={[0, 70]}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  formatter={(val: number) => [`${val}%`, 'Gross Margin']}
                />
                <Bar dataKey="marginPercent" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tab 4: Product Deep Dive Table */}
      {activeTab === 'products' && salesData && (
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6">
          <h3 className="text-base font-bold text-white mb-4">Complete Catalog Metrics</h3>
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Units Sold</th>
                  <th className="px-4 py-3">Total Revenue</th>
                  <th className="px-4 py-3">Total Gross Profit</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-900/60">
                {salesData.byProduct.map((p: any) => (
                  <tr key={p.product} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-semibold text-white">{p.product}</td>
                    <td className="px-4 py-3 text-slate-400">{p.category}</td>
                    <td className="px-4 py-3 font-mono">{p.units}</td>
                    <td className="px-4 py-3 font-mono font-bold text-white">₹{p.revenue.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 font-mono text-emerald-400">₹{p.profit.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <Badge
                        label={
                          p.product === 'Wireless Earbuds' ? 'FAST MOVING' :
                          p.product === 'Mechanical Keyboard' ? 'OVERSTOCK' :
                          p.product === 'Power Bank' ? 'LOW STOCK' : 'HEALTHY'
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
