import React, { useState, useEffect } from 'react';
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  ShieldAlert,
  Save,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Info,
  CheckCircle2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

import { useBusiness } from '../context/BusinessContext';
import { useToast } from '../context/ToastContext';
import { runSimulation, saveDecision } from '../services/api';
import { SimulationResult, WhatIfScenarioInput } from '../types';
import { Modal } from '../components/common/Modal';

export const SimulatorPage: React.FC = () => {
  const { businessId, simulatorPreset, setSimulatorPreset, setActiveTab } = useBusiness();
  const { showToast } = useToast();

  // Scenario selection
  const [scenarioType, setScenarioType] = useState<'price' | 'discount' | 'purchase' | 'marketing' | 'expense'>('price');
  const [selectedProduct, setSelectedProduct] = useState<string>('Wireless Earbuds');

  // Input states
  const [newPrice, setNewPrice] = useState<number>(1899);
  const [newDiscount, setNewDiscount] = useState<number>(10);
  const [newPurchaseQty, setNewPurchaseQty] = useState<number>(50);
  const [marketingBudgetDelta, setMarketingBudgetDelta] = useState<number>(15000);
  const [expenseReductionPercent, setExpenseReductionPercent] = useState<number>(15);

  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Save Modal
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
  const [decisionReason, setDecisionReason] = useState<string>('');
  const [decisionStatus, setDecisionStatus] = useState<string>('APPROVED');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Apply preset if came from an Insight card
  useEffect(() => {
    if (simulatorPreset) {
      setScenarioType(simulatorPreset.scenarioType);
      if (simulatorPreset.product) setSelectedProduct(simulatorPreset.product);
      if (simulatorPreset.newPrice) setNewPrice(simulatorPreset.newPrice);
      if (simulatorPreset.newPurchaseQty !== undefined) setNewPurchaseQty(simulatorPreset.newPurchaseQty);
      if (simulatorPreset.expenseReductionPercent) setExpenseReductionPercent(simulatorPreset.expenseReductionPercent);
      // Clear preset after consumption
      setSimulatorPreset(null);
    }
  }, [simulatorPreset]);

  // Execute simulation when inputs change
  useEffect(() => {
    let isMounted = true;
    async function execute() {
      try {
        setIsSimulating(true);
        const input: WhatIfScenarioInput = {
          scenarioType,
          product: selectedProduct,
          newPrice,
          newDiscountPercent: newDiscount,
          newPurchaseQty,
          marketingBudgetDelta,
          expenseReductionPercent,
          expenseCategory: 'Logistics'
        };
        const res = await runSimulation(input);
        if (isMounted) setSimulation(res);
      } catch (err: any) {
        console.error('Simulation error:', err);
      } finally {
        if (isMounted) setIsSimulating(false);
      }
    }
    execute();
    return () => { isMounted = false; };
  }, [businessId, scenarioType, selectedProduct, newPrice, newDiscount, newPurchaseQty, marketingBudgetDelta, expenseReductionPercent]);

  const handleApplyScenario = async () => {
    if (!simulation) return;
    try {
      setIsSaving(true);
      await saveDecision({
        businessId,
        title: `${scenarioType.toUpperCase()} Decision: ${selectedProduct}`,
        scenarioType,
        targetProduct: selectedProduct,
        reason: decisionReason || simulation.summaryExplanation,
        parameters: { scenarioType, newPrice, newDiscount, newPurchaseQty, marketingBudgetDelta, expenseReductionPercent },
        simulatedEffect: {
          revenueImpact: simulation.impact.revenueDiff,
          profitImpact: simulation.impact.profitDiff,
          demandImpactPercent: simulation.impact.demandChangePercent,
          summary: simulation.summaryExplanation
        },
        status: decisionStatus
      });
      showToast('Decision Committed', 'Successfully saved to Decision History timeline.', 'success');
      setIsSaveModalOpen(false);
      setActiveTab('decisions');
    } catch (err: any) {
      showToast('Save Error', err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const chartComparisonData = simulation ? [
    { name: 'Revenue', Current: simulation.baseline.revenue, Simulated: simulation.projected.revenue },
    { name: 'Cost', Current: simulation.baseline.cost, Simulated: simulation.projected.cost },
    { name: 'Net Profit', Current: simulation.baseline.profit, Simulated: simulation.projected.profit }
  ] : [];

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              What happens if I change my decision?
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Decision Lab
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Test and stress-test operational business choices before implementing them in the real world.
          </p>
        </div>

        {/* Disclaimer Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
          <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Projections based on historical & category elasticity</span>
        </div>
      </div>

      {/* Scenario Type Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'price', label: '1. Change Price' },
          { id: 'discount', label: '2. Change Discount' },
          { id: 'purchase', label: '3. Purchase Quantity' },
          { id: 'marketing', label: '4. Marketing Budget' },
          { id: 'expense', label: '5. Reduce OPEX' }
        ].map(sc => (
          <button
            key={sc.id}
            onClick={() => setScenarioType(sc.id as any)}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center ${
              scenarioType === sc.id
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {sc.label}
          </button>
        ))}
      </div>

      {/* Interactive Controls & Live Projections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Scenario Parameters Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span>Simulation Parameters</span>
          </h3>

          {/* Product Selector for product-based scenarios */}
          {(scenarioType === 'price' || scenarioType === 'discount' || scenarioType === 'purchase') && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Product</label>
              <select
                value={selectedProduct}
                onChange={e => setSelectedProduct(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Wireless Earbuds">Wireless Earbuds (Surging demand +31%)</option>
                <option value="Mechanical Keyboard">Mechanical Keyboard (Overstock & -22% drop)</option>
                <option value="Power Bank">Power Bank (Critically Low Stock: 18 left)</option>
                <option value="Smart Watch">Smart Watch (Steady)</option>
                <option value="Wireless Mouse">Wireless Mouse (Healthy)</option>
                <option value="Bluetooth Speaker">Bluetooth Speaker (Slow Moving)</option>
              </select>
            </div>
          )}

          {/* Controls for: Price */}
          {scenarioType === 'price' && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-semibold">New Unit Selling Price</span>
                  <span className="font-mono text-emerald-400 font-bold">₹{newPrice}</span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={4000}
                  step={50}
                  value={newPrice}
                  onChange={e => setNewPrice(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>₹500</span>
                  <span>Baseline: ₹{simulation?.baseline.price || 1799}</span>
                  <span>₹4,000</span>
                </div>
              </div>
            </div>
          )}

          {/* Controls for: Discount */}
          {scenarioType === 'discount' && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-semibold">Promotional Discount Rate</span>
                  <span className="font-mono text-emerald-400 font-bold">{newDiscount}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={40}
                  step={5}
                  value={newDiscount}
                  onChange={e => setNewDiscount(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Controls for: Purchase Quantity */}
          {scenarioType === 'purchase' && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-semibold">Replenishment Order Qty</span>
                  <span className="font-mono text-emerald-400 font-bold">{newPurchaseQty} units</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={300}
                  step={10}
                  value={newPurchaseQty}
                  onChange={e => setNewPurchaseQty(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Controls for: Marketing Budget */}
          {scenarioType === 'marketing' && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-semibold">Additional Ad Budget</span>
                  <span className="font-mono text-emerald-400 font-bold">+₹{marketingBudgetDelta.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min={2000}
                  max={50000}
                  step={2000}
                  value={marketingBudgetDelta}
                  onChange={e => setMarketingBudgetDelta(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Controls for: Expense Reduction */}
          {scenarioType === 'expense' && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-semibold">Logistics Reduction Target</span>
                  <span className="font-mono text-emerald-400 font-bold">{expenseReductionPercent}%</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={35}
                  step={5}
                  value={expenseReductionPercent}
                  onChange={e => setExpenseReductionPercent(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Apply Scenario Button */}
          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={() => setIsSaveModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5"
            >
              <Save className="w-4 h-4" />
              <span>APPLY SCENARIO AS DECISION</span>
            </button>
          </div>
        </div>

        {/* Right 2 Cols: Side-by-Side Current vs Simulated Table & Charts */}
        <div className="lg:col-span-2 space-y-6">
          {simulation && (
            <>
              {/* Primary Comparison Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                      Calculated Outcome
                    </span>
                    <h3 className="text-lg font-black text-white">Current vs. Projected Impact</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">
                      Elasticity: {simulation.demandElasticityUsed}
                    </span>
                  </div>
                </div>

                {/* Metrics Comparison Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* Revenue */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block font-medium">Monthly Revenue</span>
                    <div className="mt-1">
                      <span className="text-xs line-through text-slate-500 block font-mono">
                        ₹{simulation.baseline.revenue.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xl font-bold text-white font-mono">
                        ₹{simulation.projected.revenue.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className={`text-[11px] font-bold mt-1 block ${simulation.impact.revenueDiff >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {simulation.impact.revenueDiff >= 0 ? '+' : ''}₹{simulation.impact.revenueDiff.toLocaleString('en-IN')} ({simulation.impact.revenueChangePercent}%)
                    </span>
                  </div>

                  {/* Profit */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block font-medium">Net Profit</span>
                    <div className="mt-1">
                      <span className="text-xs line-through text-slate-500 block font-mono">
                        ₹{simulation.baseline.profit.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xl font-bold text-emerald-400 font-mono">
                        ₹{simulation.projected.profit.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className={`text-[11px] font-bold mt-1 block ${simulation.impact.profitDiff >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {simulation.impact.profitDiff >= 0 ? '+' : ''}₹{simulation.impact.profitDiff.toLocaleString('en-IN')} ({simulation.impact.profitChangePercent}%)
                    </span>
                  </div>

                  {/* Demand */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block font-medium">Monthly Demand</span>
                    <div className="mt-1">
                      <span className="text-xs line-through text-slate-500 block font-mono">
                        {simulation.baseline.demand} units
                      </span>
                      <span className="text-xl font-bold text-white font-mono">
                        {simulation.projected.demand} units
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-300 font-mono mt-1 block">
                      {simulation.impact.demandChangePercent >= 0 ? '+' : ''}{simulation.impact.demandChangePercent}% volume
                    </span>
                  </div>

                  {/* Working Capital / Margin */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block font-medium">Unit Margin</span>
                    <div className="mt-1">
                      <span className="text-xs line-through text-slate-500 block font-mono">
                        {simulation.baseline.marginPercent}%
                      </span>
                      <span className="text-xl font-bold text-cyan-400 font-mono">
                        {simulation.projected.marginPercent}%
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-300 mt-1 block">
                      Cost: ₹{simulation.projected.cost.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Explanation Statement */}
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 leading-relaxed font-medium">
                  {simulation.summaryExplanation}
                </div>

                {/* Visual Bar Comparison Chart */}
                <div className="h-56 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                      <YAxis
                        stroke="#64748b"
                        tick={{ fontSize: 11 }}
                        tickFormatter={val => `₹${(val / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                        formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`, '']}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                      <Bar dataKey="Current" fill="#64748b" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Simulated" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Mandatory Disclaimer */}
                <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{simulation.disclaimer}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Confirmation Modal to Save Decision */}
      <Modal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        title="Commit Business Decision"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Save this scenario into your permanent <strong className="text-white">Decision History</strong> to track simulated versus actual performance over coming reporting cycles.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Decision Reason / Hypothesis</label>
            <textarea
              rows={3}
              value={decisionReason}
              onChange={e => setDecisionReason(e.target.value)}
              placeholder="e.g. Captured higher margin on Wireless Earbuds given inelastic post-summer surge."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Initial Status</label>
            <select
              value={decisionStatus}
              onChange={e => setDecisionStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="APPROVED">APPROVED (Ready to implement)</option>
              <option value="IMPLEMENTED">IMPLEMENTED (Already applied in store)</option>
              <option value="SIMULATED">SIMULATED (Saved for evaluation)</option>
            </select>
          </div>

          <div className="flex gap-3 pt-3">
            <button
              onClick={() => setIsSaveModalOpen(false)}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyScenario}
              disabled={isSaving}
              className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md"
            >
              {isSaving ? 'Saving...' : 'SAVE DECISION'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
