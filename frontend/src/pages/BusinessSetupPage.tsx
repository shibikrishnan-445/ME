import React, { useState } from 'react';
import { Store, Building2, MapPin, Users, DollarSign, Package, ArrowRight } from 'lucide-react';
import { BusinessType } from '../types';
import { useBusiness } from '../context/BusinessContext';
import { useToast } from '../context/ToastContext';

interface BusinessSetupPageProps {
  onComplete: () => void;
}

export const BusinessSetupPage: React.FC<BusinessSetupPageProps> = ({ onComplete }) => {
  const [name, setName] = useState('UrbanKart Retail');
  const [businessType, setBusinessType] = useState<BusinessType>('Retail');
  const [employees, setEmployees] = useState(8);
  const [revenueRange, setRevenueRange] = useState('₹6,00,000 - ₹10,00,000');
  const [location, setLocation] = useState('Indiranagar, Bangalore');
  const [products, setProducts] = useState('Smart Watch, Wireless Earbuds, Mechanical Keyboard, Wireless Mouse, Power Bank, Bluetooth Speaker');
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Business Profile Created', `${name} is ready for decision intelligence.`, 'success');
    onComplete();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative">
      <div className="w-full max-w-xl bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
            <Store className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Set up your business</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Configure your business parameters for tailored intelligence</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Business Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500/60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Business Type</label>
              <select
                value={businessType}
                onChange={e => setBusinessType(e.target.value as BusinessType)}
                className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500/60"
              >
                <option value="Retail">Retail</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Food & Beverage">Food & Beverage</option>
                <option value="Services">Services</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Number of Employees</label>
              <input
                type="number"
                value={employees}
                onChange={e => setEmployees(Number(e.target.value))}
                min={1}
                className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500/60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Monthly Revenue Range</label>
              <input
                type="text"
                value={revenueRange}
                onChange={e => setRevenueRange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500/60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Location / City</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500/60"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Primary Products (comma separated)</label>
            <textarea
              rows={2}
              value={products}
              onChange={e => setProducts(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950/60 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500/60 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-emerald-500/20 transition-all pt-3"
          >
            <span>CREATE MY BUSINESS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
