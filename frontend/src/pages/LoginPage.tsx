import React, { useState } from 'react';
import { Sparkles, ArrowRight, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { useToast } from '../context/ToastContext';

interface LoginPageProps {
  onSuccess: () => void;
  onGoBack: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onGoBack }) => {
  const [email, setEmail] = useState('demo@urbankart.com');
  const [password, setPassword] = useState('password123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleLoadDemo, isLoadingDemo } = useBusiness();
  const { showToast } = useToast();

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Validation Error', 'Please enter your email address', 'error');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast('Welcome Back', 'Logged in as Business Owner', 'success');
      onSuccess();
    }, 400);
  };

  const handleDemoClick = async () => {
    await handleLoadDemo();
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/25 text-white font-extrabold text-2xl">
            S
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Sign in to SME SAGE</h2>
          <p className="text-xs text-slate-400 mt-1">Your AI Business Decision Copilot</p>
        </div>

        {/* 1-Click Demo Button */}
        <button
          onClick={handleDemoClick}
          disabled={isLoadingDemo}
          className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all mb-6 transform hover:-translate-y-0.5"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>{isLoadingDemo ? 'Setting up Demo...' : 'CONTINUE AS DEMO (UrbanKart Retail)'}</span>
        </button>

        <div className="flex items-center gap-3 my-6 text-xs text-slate-400">
          <div className="flex-1 h-px bg-slate-800" />
          <span>OR SIGN IN WITH EMAIL</span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        {/* Standard Form */}
        <form onSubmit={handleStandardLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="owner@yourbusiness.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 transition-all"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs sm:text-sm transition-all"
            >
              {isSubmitting ? 'Verifying...' : 'LOGIN'}
            </button>
            <button
              type="button"
              onClick={handleStandardLogin}
              className="flex-1 py-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-xs sm:text-sm transition-all"
            >
              CREATE ACCOUNT
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={onGoBack}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            ← Back to Landing Page
          </button>
        </div>
      </div>
    </div>
  );
};
