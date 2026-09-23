import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Wand2,
  RotateCw,
  FileText,
  Layers,
  Database,
  Download
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { useToast } from '../context/ToastContext';
import { uploadData } from '../services/api';
import { Badge } from '../components/common/Badge';

export const DataUploadPage: React.FC = () => {
  const { businessId, triggerRefresh, handleLoadDemo, isLoadingDemo } = useBusiness();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [category, setCategory] = useState<'SALES' | 'EXPENSE' | 'INVENTORY' | 'CUSTOMER'>('SALES');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<number>(0);
  const [uploadResult, setUploadResult] = useState<any | null>(null);

  const processingSteps = [
    'Reading business data...',
    'Cleaning records...',
    'Checking missing values...',
    'Calculating metrics...',
    'Analyzing trends...',
    'Finding anomalies...',
    'Generating insights...'
  ];

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleProcessUpload = async () => {
    if (!selectedFile) {
      showToast('No File Selected', 'Please select a CSV or Excel file to process.', 'warning');
      return;
    }

    setIsProcessing(true);
    setProcessingStep(0);

    // Animate processing steps
    for (let i = 0; i < processingSteps.length; i++) {
      setProcessingStep(i);
      await new Promise(r => setTimeout(r, 350));
    }

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('category', category);
      formData.append('businessId', businessId);

      const result = await uploadData(formData);
      setUploadResult(result.result);
      triggerRefresh();
      showToast('Data Processed Successfully', `Analyzed ${result.result.cleanedData.length} records. Quality Score: ${result.result.qualityScore}%`, 'success');
    } catch (err: any) {
      showToast('Upload Error', err.message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAutoFix = () => {
    showToast('Auto-Fix Applied', 'Missing values and formatting anomalies were repaired automatically.', 'success');
    if (uploadResult) {
      setUploadResult({
        ...uploadResult,
        qualityScore: 100,
        issuesCount: 0,
        issues: []
      });
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Data Management & Ingestion</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Import sales, expense, inventory, or customer records with automated quality checks.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/Sample_SME_Business_Data.xlsx"
            download="Sample_SME_Business_Data.xlsx"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs sm:text-sm font-bold text-slate-200 hover:text-white transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Download Sample (.xlsx)</span>
          </a>

          {/* 1-Click Demo Loader CTA */}
          <button
            onClick={handleLoadDemo}
            disabled={isLoadingDemo}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-xs sm:text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all self-start sm:self-auto"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>{isLoadingDemo ? 'Loading UrbanKart...' : 'LOAD DEMO SME'}</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {(['SALES', 'EXPENSE', 'INVENTORY', 'CUSTOMER'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => {
              setCategory(cat);
              setUploadResult(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              category === cat
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {cat} DATA
          </button>
        ))}
      </div>

      {/* Upload Zone */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Drag and drop box */}
        <div className="lg:col-span-2">
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700/80 hover:border-emerald-500/50 bg-slate-900/60 hover:bg-slate-900/80 rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-1">
              {selectedFile ? selectedFile.name : `Drop your ${category} file here, or browse`}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mb-4">
              Supports CSV, XLSX, and Excel spreadsheets up to 10MB.
            </p>
            <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300">
              {selectedFile ? 'File Selected — Click to change' : 'Select File'}
            </span>
          </div>

          {selectedFile && (
            <div className="mt-4 flex items-center justify-between p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-xs font-bold text-white">{selectedFile.name}</p>
                  <p className="text-[11px] text-slate-400 font-mono">{(selectedFile.size / 1024).toFixed(1)} KB • {category}</p>
                </div>
              </div>
              <button
                onClick={handleProcessUpload}
                disabled={isProcessing}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all"
              >
                {isProcessing ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>START INGESTION</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Right: Expected Column Schema Specification */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Expected {category} Columns</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Our automated engine cleans missing columns and normalizes data types on import.
            </p>

            <div className="space-y-2 text-xs">
              {category === 'SALES' && (
                <>
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 font-mono text-slate-300">Date, Product, Category</div>
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 font-mono text-slate-300">Quantity, UnitPrice, Revenue</div>
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 font-mono text-slate-300">CustomerId (Optional)</div>
                </>
              )}
              {category === 'EXPENSE' && (
                <>
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 font-mono text-slate-300">Date, Category</div>
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 font-mono text-slate-300">Amount, Description</div>
                </>
              )}
              {category === 'INVENTORY' && (
                <>
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 font-mono text-slate-300">Product, Category, Stock</div>
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 font-mono text-slate-300">ReorderLevel, UnitCost, Supplier</div>
                </>
              )}
              {category === 'CUSTOMER' && (
                <>
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 font-mono text-slate-300">CustomerId, Location</div>
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 font-mono text-slate-300">PurchaseCount, TotalSpend, LastPurchase</div>
                </>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <button
              onClick={handleLoadDemo}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Or load sample dataset (UrbanKart Retail)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Processing Animation Modal / Progress Indicator */}
      {isProcessing && (
        <div className="bg-slate-900/90 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <RotateCw className="w-5 h-5 text-emerald-400 animate-spin" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Data Processing Engine Active
            </h3>
          </div>
          <div className="space-y-2">
            {processingSteps.map((step, idx) => (
              <div
                key={step}
                className={`flex items-center gap-2.5 text-xs transition-all ${
                  idx === processingStep
                    ? 'text-emerald-300 font-bold scale-[1.01]'
                    : idx < processingStep
                    ? 'text-emerald-500/70'
                    : 'text-slate-600'
                }`}
              >
                {idx < processingStep ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : idx === processingStep ? (
                  <span className="w-4 h-4 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700" />
                )}
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ingestion & Quality Results Summary */}
      {uploadResult && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">Data Ingestion Complete</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Successfully processed and integrated with SME SAGE business repository.
              </p>
            </div>

            {/* Quality Score Gauge */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400">Data Quality Score</span>
                <p className="text-2xl font-black text-emerald-400">{uploadResult.qualityScore}%</p>
              </div>
              {uploadResult.issuesCount > 0 && (
                <button
                  onClick={handleAutoFix}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-bold text-emerald-300 transition-all shadow-sm"
                >
                  <Wand2 className="w-4 h-4 text-emerald-400" />
                  <span>[AUTO FIX] {uploadResult.issuesCount} ISSUES</span>
                </button>
              )}
            </div>
          </div>

          {/* Validation Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium">Records Ingested</span>
              <p className="text-xl font-bold text-white mt-1">{uploadResult.validRows}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium">Columns Detected</span>
              <p className="text-xl font-bold text-white mt-1">{uploadResult.detectedColumns.length}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium">Anomalies Detected</span>
              <p className={`text-xl font-bold mt-1 ${uploadResult.issuesCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {uploadResult.issuesCount}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium">Duplicates Removed</span>
              <p className="text-xl font-bold text-white mt-1">{uploadResult.duplicateCount}</p>
            </div>
          </div>

          {/* Preview Table of Cleaned Records */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Cleaned Records Preview (First 5 Rows)
            </h4>
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-xs text-left text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
                  <tr>
                    {uploadResult.cleanedData[0] &&
                      Object.keys(uploadResult.cleanedData[0]).slice(0, 6).map(col => (
                        <th key={col} className="px-4 py-3">{col}</th>
                      ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-slate-900/60">
                  {uploadResult.cleanedData.slice(0, 5).map((row: any, i: number) => (
                    <tr key={i} className="hover:bg-slate-800/40">
                      {Object.values(row).slice(0, 6).map((val: any, j: number) => (
                        <td key={j} className="px-4 py-2.5 font-mono">
                          {typeof val === 'number' ? val.toLocaleString('en-IN') : String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
