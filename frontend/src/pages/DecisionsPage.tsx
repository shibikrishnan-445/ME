import React, { useState, useEffect } from 'react';
import {
  History,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Tag,
  Calendar,
  Sparkles,
  Calculator
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { useToast } from '../context/ToastContext';
import { fetchDecisions, updateDecisionStatus } from '../services/api';
import { BusinessDecision, DecisionStatus } from '../types';
import { Badge } from '../components/common/Badge';

export const DecisionsPage: React.FC = () => {
  const { businessId, refreshKey, setActiveTab } = useBusiness();
  const { showToast } = useToast();
  const [decisions, setDecisions] = useState<BusinessDecision[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetchDecisions();
        if (isMounted) setDecisions(res.decisions);
      } catch (err) {
        console.error('Decisions error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [businessId, refreshKey]);

  const handleStatusChange = async (id: string, newStatus: DecisionStatus) => {
    try {
      await updateDecisionStatus(id, newStatus);
      setDecisions(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
      showToast('Status Updated', `Decision status transitioned to ${newStatus}`, 'success');
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Decision History & Tracking</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Audit trail of simulated, approved, and implemented business interventions.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('simulator')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md self-start sm:self-auto"
        >
          <Calculator className="w-4 h-4" />
          <span>Simulate New Decision</span>
        </button>
      </div>

      {/* Decisions Timeline */}
      <div className="space-y-4">
        {decisions.map(d => (
          <div
            key={d.id}
            className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 hover:border-slate-700/80 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  {d.date}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs font-mono uppercase text-emerald-400 font-semibold">{d.scenarioType}</span>
              </div>

              {/* Status Selector */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Status:</span>
                <select
                  value={d.status}
                  onChange={e => handleStatusChange(d.id, e.target.value as DecisionStatus)}
                  className="px-2.5 py-1 bg-slate-950 border border-slate-700 rounded-lg text-xs font-bold text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="SIMULATED">SIMULATED</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="IMPLEMENTED">IMPLEMENTED</option>
                  <option value="REVIEWING">REVIEWING</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </div>
            </div>

            {/* Decision Title & Reason */}
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">{d.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                <strong className="text-slate-400">Hypothesis / Rationale:</strong> {d.reason}
              </p>
            </div>

            {/* Simulated Effect Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  Simulated Effect
                </span>
                <p className="text-slate-200 font-medium">{d.simulatedEffect.summary || 'Projected positive margin expansion.'}</p>
                <div className="flex items-center gap-4 mt-2 font-mono text-slate-300 font-bold">
                  <span>Rev Impact: {d.simulatedEffect.revenueImpact >= 0 ? '+' : ''}₹{d.simulatedEffect.revenueImpact?.toLocaleString('en-IN')}</span>
                  <span>Profit Impact: {d.simulatedEffect.profitImpact >= 0 ? '+' : ''}₹{d.simulatedEffect.profitImpact?.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block mb-1">
                  Actual Result Tracking
                </span>
                <p className="text-slate-300 font-medium">
                  {d.actualEffect?.statusSummary || 'Currently active in store operations and tracking against month-end ledger.'}
                </p>
                {d.actualEffect && (
                  <div className="flex items-center gap-4 mt-2 font-mono text-emerald-400 font-bold">
                    <span>Observed: +₹{d.actualEffect.profitImpact?.toLocaleString('en-IN')} profit</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
