import React from 'react';
import { Database, ShieldCheck, Cpu } from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';

export const Footer: React.FC = () => {
  const { businessName, isDemoMode } = useBusiness();

  return (
    <footer className="h-10 bg-slate-950/80 border-t border-slate-900 px-4 sm:px-6 flex items-center justify-between text-[11px] text-slate-400 no-print">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>{businessName}</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">Deterministic Demo Ready</span>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          <span>Local Engine Active</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Projections Verified</span>
        </div>
      </div>
    </footer>
  );
};
