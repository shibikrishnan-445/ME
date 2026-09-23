import React from 'react';
import { Menu, Search, Bell, Sparkles, Plus, Calculator, Bot } from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';

interface HeaderProps {
  onToggleSidebar: () => void;
  alertCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, alertCount = 1 }) => {
  const { businessName, isDemoMode, setActiveTab } = useBusiness();

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between">
      {/* Left items: Menu button & Business Identity */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm sm:text-base font-bold text-white tracking-tight">
            {businessName}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Live Intelligence
          </span>
        </div>
      </div>

      {/* Center Search Input */}
      <div className="hidden md:flex items-center max-w-sm w-full mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search products, metrics, customers, decisions..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-800/60 border border-slate-700/60 rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Simulator CTA */}
        <button
          onClick={() => setActiveTab('simulator')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-xs font-semibold text-slate-200 transition-all shadow-sm"
        >
          <Calculator className="w-3.5 h-3.5 text-emerald-400" />
          <span>Decision Lab</span>
        </button>

        {/* Ask Assistant CTA */}
        <button
          onClick={() => setActiveTab('assistant')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold text-white shadow-sm shadow-emerald-500/20 transition-all"
        >
          <Bot className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ask AI</span>
        </button>

        {/* Notifications */}
        <button
          onClick={() => setActiveTab('alerts')}
          className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Alerts"
        >
          <Bell className="w-4 h-4" />
          {alertCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          )}
        </button>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-200 cursor-pointer hover:border-slate-500">
          RS
        </div>
      </div>
    </header>
  );
};
