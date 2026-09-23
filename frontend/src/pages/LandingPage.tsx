import React from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Brain,
  Calculator,
  ShieldCheck,
  ChevronRight,
  Layers,
  Database,
  BarChart3,
  Bot
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';

interface LandingPageProps {
  onEnterApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const { handleLoadDemo, isLoadingDemo } = useBusiness();

  const handleDemoClick = async () => {
    await handleLoadDemo();
    onEnterApp();
  };

  const pipelineSteps = [
    { step: '01', title: 'DATA', desc: 'Raw business records from Excel, POS, or CSV' },
    { step: '02', title: 'UNDERSTAND', desc: 'Automatic cleaning, validation & metric calculation' },
    { step: '03', title: 'DETECT', desc: 'Real-time anomaly & margin compression detection' },
    { step: '04', title: 'EXPLAIN', desc: 'Deterministic root-cause business diagnosis' },
    { step: '05', title: 'RECOMMEND', desc: 'Actionable operational interventions' },
    { step: '06', title: 'SIMULATE', desc: 'What-if outcome projection before taking action' },
    { step: '07', title: 'DECIDE', desc: 'Commit decisions and track actual vs projected ROI' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Navbar */}
      <header className="h-20 border-b border-slate-800/80 px-6 sm:px-12 flex items-center justify-between max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/25 text-white font-extrabold text-xl">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white">SME SAGE</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Decision Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Turn Business Data into Better Decisions</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onEnterApp}
            className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-white px-3 py-2 transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={handleDemoClick}
            disabled={isLoadingDemo}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-xs sm:text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>{isLoadingDemo ? 'Loading Demo...' : 'LOAD DEMO SME'}</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-12 py-16 sm:py-24 flex flex-col items-center text-center">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Not just another dashboard — Your AI Business Decision Copilot</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight max-w-4xl leading-[1.1] mb-6">
          Turn Business Data into{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            Better Decisions
          </span>
        </h1>

        {/* Description */}
        <p className="text-base sm:text-xl text-slate-300 max-w-2xl leading-relaxed mb-10 font-normal">
          Upload your sales, inventory, expense, and customer data. Understand what is happening, discover why it happened, and{' '}
          <strong className="text-white font-semibold">simulate decisions in a risk-free sandbox</strong> before you act.
        </p>

        {/* Hero CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-20">
          <button
            onClick={onEnterApp}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-white text-slate-950 font-extrabold text-sm sm:text-base hover:bg-slate-200 shadow-xl transition-all transform hover:-translate-y-0.5"
          >
            <span>GET STARTED</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleDemoClick}
            disabled={isLoadingDemo}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-white font-bold text-sm sm:text-base shadow-lg transition-all"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{isLoadingDemo ? 'Setting Up...' : 'VIEW DEMO (UrbanKart Retail)'}</span>
          </button>
        </div>

        {/* The Continuous Decision Pipeline */}
        <section className="w-full py-12 border-t border-slate-800/80 mb-16 text-left">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">The SME SAGE Pipeline</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">From Raw Numbers to Measured Impact</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
            {pipelineSteps.map((step, idx) => (
              <div
                key={step.step}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all relative group"
              >
                <div>
                  <div className="text-[10px] font-mono font-bold text-emerald-400 mb-2">{step.step}</div>
                  <h3 className="text-sm font-bold text-white mb-1.5">{step.title}</h3>
                  <p className="text-xs text-slate-400 leading-snug">{step.desc}</p>
                </div>
                {idx < pipelineSteps.length - 1 && (
                  <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-700">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Card 1: Data Integration */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-8 hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-6">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">DATA</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              "Bring your sales, inventory, expense and customer data together." Automated CSV/XLSX cleaning, missing value resolution, and data quality scoring.
            </p>
          </div>

          {/* Card 2: Intelligence */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-8 hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-6">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">INTELLIGENCE</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              "Detect trends, anomalies and business problems automatically." 5-pillar Business Health Score (78/100) and root-cause explanations in simple business language.
            </p>
          </div>

          {/* Card 3: Decision Lab */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-8 hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
              <Calculator className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">DECISIONS</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              "Simulate possible actions before making a business decision." Test price revisions, supplier replenishment orders, and discount impacts with elastic demand modeling.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 px-6 text-center text-xs text-slate-500">
        <p>© 2026 SME SAGE — AI-Powered SME Decision Intelligence Platform. Built for hackathon demonstration.</p>
      </footer>
    </div>
  );
};
