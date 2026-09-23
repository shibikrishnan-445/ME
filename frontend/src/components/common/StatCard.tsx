import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { KPICardData } from '../../types';

interface StatCardProps {
  kpi: KPICardData;
  icon?: React.ReactNode;
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ kpi, icon, subtitle }) => {
  const isUp = kpi.trendPercentage > 0;
  const isDown = kpi.trendPercentage < 0;

  return (
    <div className="bg-slate-900/80 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {kpi.title}
        </span>
        {icon && (
          <div className="p-2 rounded-xl bg-slate-800/80 text-slate-300 border border-slate-700/50">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {kpi.displayValue}
        </h3>
        {kpi.trendPercentage !== undefined && (
          <div
            className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
              kpi.isPositive
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}
          >
            {isUp ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : isDown ? (
              <TrendingDown className="w-3.5 h-3.5" />
            ) : (
              <Minus className="w-3.5 h-3.5" />
            )}
            <span>
              {isUp ? '↑' : isDown ? '↓' : ''} {Math.abs(kpi.trendPercentage)}%
            </span>
          </div>
        )}
      </div>

      <p className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
        <span>{subtitle || kpi.periodText || 'vs previous month'}</span>
      </p>
    </div>
  );
};
