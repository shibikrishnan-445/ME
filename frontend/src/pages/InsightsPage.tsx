import React, { useState, useEffect } from 'react';
import {
  Lightbulb,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Package,
  DollarSign,
  Calculator,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Info
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { fetchInsights } from '../services/api';
import { AIInsight } from '../types';
import { Badge } from '../components/common/Badge';

export const InsightsPage: React.FC = () => {
  const { businessId, refreshKey, setActiveTab, setSimulatorPreset } = useBusiness();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetchInsights();
        if (isMounted) setInsights(res.insights);
      } catch (err) {
        console.error('Insights fetch error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [businessId, refreshKey]);

  const handleSimulate = (insight: AIInsight) => {
    if (insight.simulationPreset) {
      setSimulatorPreset(insight.simulationPreset as any);
    }
    setActiveTab('simulator');
  };

  const categories = ['ALL', 'Revenue Drop', 'Inventory Risk', 'Expense Spike', 'Revenue Growth'];

  const filtered = insights.filter(i => {
    if (selectedCategory === 'ALL') return true;
    return i.category === selectedCategory;
  });

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">AI Insights & Root Cause Engine</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Core Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Deterministic diagnostic analysis linking business symptoms to operational root causes and testable decisions.
          </p>
        </div>

        {/* Engine Label Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Demo Intelligence Engine Active</span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Insights Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(item => (
          <div
            key={item.id}
            className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-3xl p-6 shadow-xl flex flex-col justify-between transition-all"
          >
            <div className="space-y-4">
              {/* Category, Severity & Title */}
              <div className="flex items-center justify-between">
                <Badge label={item.category} />
                <span className="text-[11px] text-slate-500 font-mono">ID: {item.id}</span>
              </div>

              <h2 className="text-lg font-extrabold text-white tracking-tight leading-snug">
                {item.title}
              </h2>

              {/* PROBLEM Section */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider block mb-1">
                  1. The Business Problem
                </span>
                <p className="text-xs text-slate-200 font-medium leading-relaxed">
                  {item.problem}
                </p>
              </div>

              {/* EVIDENCE Section */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider block mb-1">
                  2. Quantitative Evidence
                </span>
                <p className="text-xs text-slate-300 font-mono leading-relaxed">
                  {item.evidence}
                </p>
              </div>

              {/* POSSIBLE REASON / ROOT CAUSE */}
              <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block mb-1">
                  3. Possible Root Cause
                </span>
                <p className="text-xs text-amber-200/90 leading-relaxed font-medium">
                  {item.possibleReason}
                </p>
              </div>

              {/* RECOMMENDED ACTION */}
              <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block mb-1">
                  4. Recommended Action
                </span>
                <p className="text-xs text-emerald-200 font-medium leading-relaxed">
                  {item.recommendedAction}
                </p>
              </div>
            </div>

            {/* Bottom Action Button */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                {item.source}
              </span>
              <button
                onClick={() => handleSimulate(item)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5"
              >
                <Calculator className="w-4 h-4" />
                <span>SIMULATE THIS ACTION</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
