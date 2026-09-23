import React, { useState, useEffect } from 'react';
import {
  FileText,
  Printer,
  Download,
  CheckCircle2,
  Calendar,
  Building,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { generateReport } from '../services/api';
import { Badge } from '../components/common/Badge';

export const ReportsPage: React.FC = () => {
  const { businessId, refreshKey } = useBusiness();
  const [report, setReport] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function loadReport() {
      try {
        setLoading(true);
        const data = await generateReport();
        if (isMounted) setReport(data);
      } catch (err) {
        console.error('Report error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadReport();
    return () => { isMounted = false; };
  }, [businessId, refreshKey]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header and Print Action (hidden during print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Executive Business Dossier</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Consolidated intelligence summary ready for stakeholders, board review, and lenders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>PRINT / SAVE AS PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document */}
      {report && (
        <div className="report-page bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-8 shadow-2xl text-slate-200">
          {/* Report Document Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
                  SME SAGE Intelligence Dossier
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">{report.generatedAt}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {report.business.name}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {report.business.type} • {report.business.location}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Health Score
              </span>
              <p className="text-3xl font-black text-emerald-400 mt-0.5">
                {report.healthScore.overallScore} <span className="text-xs text-slate-500">/ 100</span>
              </p>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              1. Executive Performance Summary
            </h3>
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm leading-relaxed text-slate-300">
              {report.executiveSummary}
            </div>
          </div>

          {/* Section 2: Key Financial Snapshot */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              2. Financial Performance Snapshot
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Revenue</span>
                <p className="text-lg font-bold text-white font-mono mt-1">₹{(report.financials.totalRevenue / 100000).toFixed(2)} Lakhs</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Total OPEX</span>
                <p className="text-lg font-bold text-rose-400 font-mono mt-1">₹{(report.financials.totalExpenses / 100000).toFixed(2)} Lakhs</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Net Operating Profit</span>
                <p className="text-lg font-bold text-emerald-400 font-mono mt-1">₹{(report.financials.netProfit / 100000).toFixed(2)} Lakhs</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Gross Margin Ratio</span>
                <p className="text-lg font-bold text-cyan-400 font-mono mt-1">{report.financials.grossMargin}</p>
              </div>
            </div>
          </div>

          {/* Section 3: Inventory Assessment */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              3. Inventory & Working Capital Exposure
            </h3>
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Critical Stockout Risk:</span>
                <span className="font-bold text-rose-400 font-mono">{report.inventoryAssessment.criticalRisk}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Overstock Capital Lockup:</span>
                <span className="font-bold text-amber-400 font-mono">{report.inventoryAssessment.capitalLockup}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Top Velocity Contributor:</span>
                <span className="font-bold text-emerald-400 font-mono">{report.inventoryAssessment.topMover}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Problems Detected & Recommended Interventions */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              4. Detected Business Problems & Direct AI Recommendations
            </h3>
            <div className="space-y-2">
              {report.problemsDetected.map((p: any, i: number) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge label={p.category} />
                    <span className="font-bold text-white">{p.problem}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed pl-1 pt-1">
                    <strong className="text-slate-300">Action:</strong> {p.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Document Signoff Footer */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
            <span>Verified by SME SAGE Autonomous Intelligence Core</span>
            <span>Document Checksum: SAGE-UK-2026-09</span>
          </div>
        </div>
      )}
    </div>
  );
};
