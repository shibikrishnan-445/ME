import React, { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  AlertCircle,
  Search,
  ArrowUpRight,
  ShieldAlert,
  MapPin,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { fetchCustomers } from '../services/api';
import { CustomerRecord } from '../types';
import { Badge } from '../components/common/Badge';

export const CustomersPage: React.FC = () => {
  const { businessId, refreshKey, setActiveTab } = useBusiness();
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [summary, setSummary] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [segmentFilter, setSegmentFilter] = useState<string>('ALL');

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetchCustomers();
        if (isMounted) {
          setCustomers(res.customers);
          setSummary(res.summary);
        }
      } catch (err) {
        console.error('Customer fetch error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [businessId, refreshKey]);

  const filtered = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSegment = segmentFilter === 'ALL' || c.segment === segmentFilter;
    return matchesSearch && matchesSegment;
  });

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Customer Retention Intelligence</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          RFM segmentation, high-value repeat buyers, and early churn risk detection.
        </p>
      </div>

      {/* KPI Cards Grid */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Customer Accounts</span>
            <p className="text-2xl font-black text-white mt-1">{summary.totalCustomers}</p>
            <span className="text-[10px] text-emerald-400 mt-0.5 block">↑ 8.5% this quarter</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Retention Rate</span>
            <p className="text-2xl font-black text-emerald-400 mt-1">{summary.retentionRate}%</p>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Active within 90 days</span>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
            <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">VIP High Value</span>
            <p className="text-2xl font-black text-indigo-300 mt-1">{summary.segments.highValue}</p>
            <span className="text-[10px] text-indigo-400/80 mt-0.5 block">&gt; ₹30,000 spend</span>
          </div>

          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
            <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider">At-Risk Churn</span>
            <p className="text-2xl font-black text-rose-300 mt-1">{summary.segments.atRisk}</p>
            <span className="text-[10px] text-rose-400/80 mt-0.5 block">&gt; 90 days inactive</span>
          </div>
        </div>
      )}

      {/* Churn Warning Callout Banner */}
      {summary?.segments.atRisk > 0 && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <span className="font-bold text-rose-300 block">Churn Risk Alert: {summary.segments.atRisk} Inactive Customers Detected</span>
              <span className="text-slate-300">{summary.atRiskExplanation}</span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('simulator')}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs transition-colors"
          >
            Simulate Re-engagement Promo
          </button>
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search customer name or location..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-900/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'HIGH VALUE', 'REGULAR', 'OCCASIONAL', 'AT RISK'].map(seg => (
            <button
              key={seg}
              onClick={() => setSegmentFilter(seg)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                segmentFilter === seg
                  ? 'bg-slate-800 text-white border border-slate-700 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {seg}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Customer Name & ID</th>
                <th className="px-4 py-3.5">Location</th>
                <th className="px-4 py-3.5">Orders</th>
                <th className="px-4 py-3.5">Total Lifetime Spend</th>
                <th className="px-4 py-3.5">Last Purchase</th>
                <th className="px-4 py-3.5">Inactivity</th>
                <th className="px-4 py-3.5">Segment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-white text-sm">{c.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{c.customerId}</p>
                  </td>
                  <td className="px-4 py-3.5 text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{c.location}</span>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-slate-200">
                    {c.purchaseCount} orders
                  </td>
                  <td className="px-4 py-3.5 font-mono font-bold text-white">
                    ₹{c.totalSpend.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3.5 text-slate-400 font-mono">
                    {c.lastPurchaseDate}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={c.daysSinceLastPurchase >= 90 ? 'text-rose-400 font-bold font-mono' : 'text-slate-300 font-mono'}>
                      {c.daysSinceLastPurchase} days ago
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge label={c.segment} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
