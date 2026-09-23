import React, { useState, useEffect } from 'react';
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  Search,
  Filter,
  ShoppingCart,
  Sparkles,
  Info,
  Layers
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { useToast } from '../context/ToastContext';
import { fetchInventory, reorderInventory } from '../services/api';
import { InventoryItem, InventoryStatus } from '../types';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';

export const InventoryPage: React.FC = () => {
  const { businessId, refreshKey, triggerRefresh } = useBusiness();
  const { showToast } = useToast();

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [summary, setSummary] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Reorder modal state
  const [reorderItem, setReorderItem] = useState<InventoryItem | null>(null);
  const [reorderQty, setReorderQty] = useState<number>(50);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetchInventory();
        if (isMounted) {
          setItems(res.items);
          setSummary(res.summary);
        }
      } catch (err: any) {
        showToast('Error', err.message, 'error');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [businessId, refreshKey]);

  const handleReorderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reorderItem) return;
    try {
      setIsSubmitting(true);
      await reorderInventory(reorderItem.product, reorderQty);
      showToast('Reorder Dispatched', `Placed purchase order for ${reorderQty} units of ${reorderItem.product}.`, 'success');
      setReorderItem(null);
      triggerRefresh();
    } catch (err: any) {
      showToast('Reorder Error', err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Inventory Intelligence</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track stock coverage, demand runway, and capital tied up in slow-moving items.
          </p>
        </div>

        {/* Formula Explainer Pill */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono self-start sm:self-auto">
          <Info className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Stock Coverage = Current Stock / Avg Monthly Sales</span>
        </div>
      </div>

      {/* Summary KPI Badges Grid */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Inventory Value</span>
            <p className="text-xl sm:text-2xl font-black text-white mt-1">
              ₹{(summary.totalValue / 100000).toFixed(2)} Lakhs
            </p>
            <span className="text-[10px] text-slate-400 mt-0.5 block">{summary.totalItems} Active SKUs</span>
          </div>

          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
            <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider">Low Stock</span>
            <p className="text-xl sm:text-2xl font-black text-rose-300 mt-1">{summary.lowStockCount} SKU</p>
            <span className="text-[10px] text-rose-400/80 mt-0.5 block">Below reorder level</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">Overstock</span>
            <p className="text-xl sm:text-2xl font-black text-amber-300 mt-1">{summary.overstockCount} SKU</p>
            <span className="text-[10px] text-amber-400/80 mt-0.5 block">&gt; 4 months coverage</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Healthy</span>
            <p className="text-xl sm:text-2xl font-black text-emerald-300 mt-1">{summary.healthyCount} SKUs</p>
            <span className="text-[10px] text-emerald-400/80 mt-0.5 block">1 - 3 months coverage</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Slow Moving</span>
            <p className="text-xl sm:text-2xl font-black text-slate-200 mt-1">{summary.slowMovingCount} SKU</p>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Low demand velocity</span>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by product or category..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-900/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'LOW STOCK', 'HEALTHY', 'OVERSTOCK', 'SLOW MOVING'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-slate-800 text-white border border-slate-700 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Inventory Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Product & Supplier</th>
                <th className="px-4 py-3.5">Stock</th>
                <th className="px-4 py-3.5">Avg Monthly Sales</th>
                <th className="px-4 py-3.5">Stock Coverage</th>
                <th className="px-4 py-3.5">Inventory Status</th>
                <th className="px-4 py-3.5">AI Explanation & Action</th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                  {/* Product */}
                  <td className="px-5 py-4">
                    <p className="font-bold text-white text-sm">{item.product}</p>
                    <p className="text-[11px] text-slate-400">{item.category} • {item.supplier}</p>
                  </td>

                  {/* Stock */}
                  <td className="px-4 py-4">
                    <span className="font-mono text-sm font-bold text-slate-100">{item.stock}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">Min: {item.reorderLevel}</span>
                  </td>

                  {/* Monthly Sales */}
                  <td className="px-4 py-4 font-mono text-slate-200">
                    {item.avgMonthlySales} units/mo
                  </td>

                  {/* Stock Coverage Months */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5 font-bold font-mono">
                      <span className={item.stockCoverageMonths > 4 ? 'text-amber-400' : item.stockCoverageMonths < 1 ? 'text-rose-400' : 'text-emerald-400'}>
                        {item.stockCoverageMonths}
                      </span>
                      <span className="text-slate-400 text-[10px]">months</span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-4">
                    <Badge label={item.status} />
                  </td>

                  {/* AI Explanation */}
                  <td className="px-4 py-4 max-w-xs text-[11px] text-slate-300 leading-snug">
                    {item.aiExplanation}
                  </td>

                  {/* Reorder Button */}
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => {
                        setReorderItem(item);
                        setReorderQty(item.status === 'LOW STOCK' ? 80 : 50);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 border border-slate-700 text-slate-300 font-bold text-xs transition-all flex items-center gap-1.5 ml-auto"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Reorder</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reorder Procurement Modal */}
      <Modal
        isOpen={Boolean(reorderItem)}
        onClose={() => setReorderItem(null)}
        title={`Replenish Inventory: ${reorderItem?.product}`}
      >
        {reorderItem && (
          <form onSubmit={handleReorderSubmit} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Current Stock:</span>
                <span className="font-mono text-white font-bold">{reorderItem.stock} units</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Unit Cost:</span>
                <span className="font-mono text-white font-bold">₹{reorderItem.unitCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Supplier:</span>
                <span className="text-emerald-400 font-semibold">{reorderItem.supplier}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Purchase Order Quantity (units)</label>
              <input
                type="number"
                min={10}
                max={500}
                step={5}
                value={reorderQty}
                onChange={e => setReorderQty(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
              Total Order Capital Commitment: <strong className="font-mono">₹{(reorderQty * reorderItem.unitCost).toLocaleString('en-IN')}</strong>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setReorderItem(null)}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md"
              >
                {isSubmitting ? 'Submitting...' : 'Confirm Purchase Order'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
