import React, { useState } from 'react';
import {
  Settings,
  Building,
  Cpu,
  RotateCcw,
  ShieldCheck,
  Bell,
  Palette,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { useToast } from '../context/ToastContext';

export const SettingsPage: React.FC = () => {
  const { businessName, handleLoadDemo, isLoadingDemo } = useBusiness();
  const { showToast } = useToast();

  const [aiProvider, setAiProvider] = useState<'local' | 'openai' | 'anthropic'>('local');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Settings Saved', 'Platform configuration updated.', 'success');
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">System & Business Settings</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage business metadata, decision engine configurations, and demo environments.
        </p>
      </div>

      <div className="space-y-6">
        {/* Section 1: Business Profile */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5">
            <Building className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Business Profile</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Registered Entity</label>
              <input
                type="text"
                defaultValue={businessName}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Base Operating Currency</label>
              <input
                type="text"
                defaultValue="₹ (INR)"
                disabled
                className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-400"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Primary Facility</label>
              <input
                type="text"
                defaultValue="Indiranagar, Bangalore"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Industry Classification</label>
              <input
                type="text"
                defaultValue="Retail / Consumer Electronics"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: AI & Decision Intelligence Engine */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">AI Engine Configuration</h3>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            SME SAGE features a zero-latency deterministic local intelligence engine designed for hackathons and offline resilience. External AI providers can be enabled via environment variables.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs">
              <span className="font-bold text-emerald-400 block mb-1">Local Intelligence Engine</span>
              <p className="text-[11px] text-slate-300">Active • 100% Deterministic • Zero API fees</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
              <span className="font-bold text-slate-200 block mb-1">External OpenAI / Gemini</span>
              <p className="text-[11px] text-slate-400">Pluggable via .env API_KEY</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
              <span className="font-bold text-slate-200 block mb-1">Security & Privacy</span>
              <p className="text-[11px] text-slate-400">No raw data leaves local environment</p>
            </div>
          </div>
        </div>

        {/* Section 3: Demo Management & Database Reset */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Hackathon Presentation Control</h3>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Quickly restore the standardized UrbanKart Retail presentation dataset. This guarantees consistent presentation numbers for hackathon demonstrations.
          </p>

          <button
            onClick={handleLoadDemo}
            disabled={isLoadingDemo}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all shadow-sm"
          >
            <RotateCcw className={`w-4 h-4 text-emerald-400 ${isLoadingDemo ? 'animate-spin' : ''}`} />
            <span>{isLoadingDemo ? 'Resetting Database...' : 'Re-Seed Demo Data (UrbanKart Retail)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
