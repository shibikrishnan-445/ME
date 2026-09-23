import React, { useState } from 'react';
import { Sparkles, ArrowRight, Lock, Mail, User, Building, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { useToast } from '../context/ToastContext';

interface LoginPageProps {
  onSuccess: () => void;
  onGoBack: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onGoBack }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  
  // Sign In State
  const [signInEmail, setSignInEmail] = useState('demo@urbankart.com');
  const [signInPassword, setSignInPassword] = useState('password123');

  // Sign Up State
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleLoadDemo, isLoadingDemo } = useBusiness();
  const { showToast } = useToast();

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail) {
      showToast('Validation Error', 'Please enter your email address', 'error');
      return;
    }
    if (!signInPassword) {
      showToast('Validation Error', 'Please enter your password', 'error');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast('Welcome Back!', 'Successfully signed in as Business Owner', 'success');
      onSuccess();
    }, 500);
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) {
      showToast('Validation Error', 'Please enter your full name', 'error');
      return;
    }
    if (!businessName) {
      showToast('Validation Error', 'Please enter your business name', 'error');
      return;
    }
    if (!signUpEmail) {
      showToast('Validation Error', 'Please enter a valid email address', 'error');
      return;
    }
    if (!signUpPassword || signUpPassword.length < 6) {
      showToast('Validation Error', 'Password must be at least 6 characters long', 'error');
      return;
    }
    if (signUpPassword !== confirmPassword) {
      showToast('Validation Error', 'Passwords do not match', 'error');
      return;
    }
    if (!agreeTerms) {
      showToast('Validation Error', 'Please accept the Terms of Service', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast('Account Created!', `Welcome to SME SAGE, ${fullName}`, 'success');
      onSuccess();
    }, 600);
  };

  const handleDemoClick = async () => {
    await handleLoadDemo();
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10">
        {/* Logo / Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/25 text-white font-extrabold text-2xl">
            S
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">SME SAGE Platform</h2>
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

        {/* Tab Selector: Sign In vs Sign Up */}
        <div className="flex rounded-xl bg-slate-950/80 p-1 border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'signin'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            SIGN IN
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'signup'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            SIGN UP
          </button>
        </div>

        {/* SIGN IN FORM */}
        {mode === 'signin' && (
          <form onSubmit={handleSignInSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={signInEmail}
                  onChange={e => setSignInEmail(e.target.value)}
                  placeholder="owner@urbankart.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">Password</label>
                <button type="button" className="text-[11px] text-emerald-400 hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={signInPassword}
                  onChange={e => setSignInPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'SIGN IN TO DASHBOARD'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* SIGN UP FORM */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Alex Morgan"
                  className="w-full pl-10 pr-4 py-2 bg-slate-950/60 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Business / SME Name</label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  placeholder="UrbanKart Enterprises"
                  className="w-full pl-10 pr-4 py-2 bg-slate-950/60 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={signUpEmail}
                  onChange={e => setSignUpEmail(e.target.value)}
                  placeholder="alex@urbankart.com"
                  className="w-full pl-10 pr-4 py-2 bg-slate-950/60 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={signUpPassword}
                    onChange={e => setSignUpPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2 bg-slate-950/60 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2 bg-slate-950/60 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={e => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900"
              />
              <label htmlFor="terms" className="text-[11px] text-slate-400">
                I agree to the <span className="text-slate-200 underline cursor-pointer">Terms of Service</span> & <span className="text-slate-200 underline cursor-pointer">Privacy Policy</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 mt-2"
            >
              <span>{isSubmitting ? 'Creating Account...' : 'CREATE NEW ACCOUNT'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
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

