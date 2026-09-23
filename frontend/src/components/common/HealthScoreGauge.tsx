import React from 'react';
import { BusinessHealthScore } from '../../types';
import { ShieldCheck, AlertCircle, ArrowUpRight, Info } from 'lucide-react';

interface HealthScoreGaugeProps {
  healthScore: BusinessHealthScore;
}

export const HealthScoreGauge: React.FC<HealthScoreGaugeProps> = ({ healthScore }) => {
  const { overallScore, statusText, components, explanations } = healthScore;

  const componentList = [
    { key: 'revenueGrowth', label: 'Revenue Growth', score: components.revenueGrowth, weight: '25%' },
    { key: 'profitability', label: 'Profitability', score: components.profitability, weight: '25%' },
    { key: 'inventoryHealth', label: 'Inventory Health', score: components.inventoryHealth, weight: '20%' },
    { key: 'customerRetention', label: 'Customer Retention', score: components.customerRetention, weight: '15%' },
    { key: 'expenseControl', label: 'Expense Control', score: components.expenseControl, weight: '15%' }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-500';
    if (score >= 70) return 'text-amber-400 bg-amber-500';
    return 'text-rose-400 bg-rose-500';
  };

  return (
    <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950/90 border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center gap-6 justify-between">
        {/* Left: Overall Health Score Circle & Assessment */}
        <div className="flex items-center gap-5 sm:gap-6">
          {/* Circular Score Badge */}
          <div className="relative shrink-0 flex items-center justify-center w-28 h-28 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="6"
                className="text-slate-800"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="6"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * overallScore) / 100}
                strokeLinecap="round"
                className="text-emerald-400 transition-all duration-1000 ease-out"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-white tracking-tight">{overallScore}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">/ 100</span>
            </div>
          </div>

          {/* Title & Verdict */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                AI Health Diagnostic
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Calculated
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1 tracking-tight">
              Business Health Score
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md leading-relaxed font-medium">
              "{statusText}"
            </p>
          </div>
        </div>

        {/* Right: 5 Component Progress Bars */}
        <div className="flex-1 max-w-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800/80">
          {componentList.map(comp => {
            const exp = explanations[comp.key as keyof typeof explanations];
            return (
              <div key={comp.key} className="group relative">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-300 font-medium">{comp.label}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({comp.weight})</span>
                  </div>
                  <span className={`font-bold font-mono text-xs ${getScoreColor(comp.score).split(' ')[0]}`}>
                    {comp.score}/100
                  </span>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${getScoreColor(comp.score).split(' ')[1]}`}
                    style={{ width: `${comp.score}%` }}
                  />
                </div>
                {/* Hover explanation tooltip */}
                <p className="text-[10px] text-slate-400 mt-0.5 truncate group-hover:text-slate-200 transition-colors">
                  {exp}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
