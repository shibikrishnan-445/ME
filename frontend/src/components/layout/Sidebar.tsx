import React from 'react';
import {
  LayoutDashboard,
  BarChart3,
  Package,
  Lightbulb,
  Calculator,
  Bot,
  Users,
  Bell,
  History,
  FileText,
  Settings,
  UploadCloud,
  Sparkles,
  ChevronRight,
  TrendingUp,
  X
} from 'lucide-react';
import { useBusiness, NavTab } from '../../context/BusinessContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  alertCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, alertCount = 1 }) => {
  const { activeTab, setActiveTab, handleLoadDemo, isLoadingDemo, isDemoMode } = useBusiness();

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'inventory', label: 'Inventory', icon: <Package className="w-5 h-5" />, badge: 'Alert' },
    { id: 'insights', label: 'AI Insights', icon: <Lightbulb className="w-5 h-5 text-amber-400" />, badge: '5 New' },
    { id: 'simulator', label: 'Decision Simulator', icon: <Calculator className="w-5 h-5 text-emerald-400" /> },
    { id: 'assistant', label: 'Ask Your Business', icon: <Bot className="w-5 h-5 text-indigo-400" /> },
    { id: 'customers', label: 'Customers', icon: <Users className="w-5 h-5" /> },
    { id: 'alerts', label: 'Smart Alerts', icon: <Bell className="w-5 h-5" />, badge: alertCount > 0 ? String(alertCount) : undefined },
    { id: 'decisions', label: 'Decision History', icon: <History className="w-5 h-5" /> },
    { id: 'reports', label: 'Executive Reports', icon: <FileText className="w-5 h-5" /> },
    { id: 'data', label: 'Data Management', icon: <UploadCloud className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900/95 border-r border-slate-800/80 backdrop-blur-xl flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold text-lg">
              S
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white">SME SAGE</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">AI</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight">Decision Intelligence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo SME Quick Loader Button */}
        <div className="p-4 border-b border-slate-800/60">
          <button
            onClick={handleLoadDemo}
            disabled={isLoadingDemo}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-300 text-xs font-semibold shadow-sm transition-all group hover:bg-emerald-500/20"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>{isLoadingDemo ? 'Loading UrbanKart...' : 'LOAD DEMO SME'}</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">1-Click</span>
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                      item.id === 'alerts'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : item.id === 'insights'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Business Card */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-200">
                UK
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-200 truncate">UrbanKart Retail</p>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Demo Mode Active
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('settings')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              title="Settings"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
