import React, { useState, useEffect } from 'react';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Package,
  DollarSign,
  ArrowRight,
  ShieldAlert,
  CheckCheck
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { fetchAlerts, markAlertRead } from '../services/api';
import { SmartAlert } from '../types';
import { Badge } from '../components/common/Badge';

export const AlertsPage: React.FC = () => {
  const { businessId, refreshKey, setActiveTab } = useBusiness();
  const [alerts, setAlerts] = useState<SmartAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetchAlerts();
        if (isMounted) setAlerts(res.alerts);
      } catch (err) {
        console.error('Alerts error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [businessId, refreshKey]);

  const handleMarkAsRead = async (id: string) => {
    await markAlertRead(id);
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
  };

  const filtered = alerts.filter(a => {
    if (priorityFilter === 'ALL') return true;
    return a.priority === priorityFilter;
  });

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Smart Business Alerts</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
              Live Monitor
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time threshold breaches, stockout projections, and margin alerts.
          </p>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
          {['ALL', 'CRITICAL', 'WARNING', 'POSITIVE'].map(p => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                priorityFilter === p
                  ? 'bg-slate-800 text-white font-bold border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filtered.map(item => (
          <div
            key={item.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              item.isRead
                ? 'bg-slate-950/40 border-slate-800/60 opacity-70'
                : item.priority === 'CRITICAL'
                ? 'bg-rose-500/5 border-rose-500/30'
                : item.priority === 'WARNING'
                ? 'bg-amber-500/5 border-amber-500/30'
                : 'bg-emerald-500/5 border-emerald-500/30'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-2.5 rounded-xl shrink-0 ${
                  item.priority === 'CRITICAL'
                    ? 'bg-rose-500/10 text-rose-400'
                    : item.priority === 'WARNING'
                    ? 'bg-amber-500/10 text-amber-400'
                    : 'bg-emerald-500/10 text-emerald-400'
                }`}
              >
                {item.priority === 'CRITICAL' ? (
                  <ShieldAlert className="w-5 h-5" />
                ) : item.priority === 'WARNING' ? (
                  <AlertTriangle className="w-5 h-5" />
                ) : (
                  <TrendingUp className="w-5 h-5" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge label={item.priority} />
                  <span className="text-xs font-mono text-slate-400">{item.type}</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white">{item.title}</h3>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{item.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              {!item.isRead && (
                <button
                  onClick={() => handleMarkAsRead(item.id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark Read</span>
                </button>
              )}
              <button
                onClick={() => setActiveTab(item.targetModule as any)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-colors flex items-center gap-1"
              >
                <span>View Module</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
