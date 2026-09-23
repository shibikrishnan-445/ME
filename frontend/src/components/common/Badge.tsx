import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'emerald' | 'amber' | 'rose' | 'blue' | 'indigo' | 'slate';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'slate', size = 'sm' }) => {
  const variantStyles = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    slate: 'bg-slate-800 text-slate-300 border-slate-700'
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1'
  };

  // Map known statuses to auto variants
  let activeVariant = variant;
  if (label === 'HEALTHY' || label === 'POSITIVE' || label === 'IMPLEMENTED' || label === 'APPROVED') {
    activeVariant = 'emerald';
  } else if (label === 'OVERSTOCK' || label === 'WARNING' || label === 'SLOW MOVING' || label === 'REVIEWING') {
    activeVariant = 'amber';
  } else if (label === 'LOW STOCK' || label === 'CRITICAL' || label === 'DEAD STOCK') {
    activeVariant = 'rose';
  } else if (label === 'HIGH VALUE') {
    activeVariant = 'indigo';
  }

  return (
    <span className={`inline-flex items-center font-semibold rounded-full border ${variantStyles[activeVariant]} ${sizeStyles[size]}`}>
      {label}
    </span>
  );
};
