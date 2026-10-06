import React from 'react';
import { Sparkles } from 'lucide-react';

export function Badge({
  children,
  variant = 'sand',
  size = 'sm',
  className = '',
  icon: Icon,
  score,
}) {
  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 font-medium tracking-wide',
    md: 'text-xs px-3 py-1 font-semibold tracking-wide',
  };

  const variants = {
    sand: 'bg-sand-light text-taupe-dark border border-sand',
    rose: 'bg-rose-light text-rose-clay border border-rose-subtle',
    ink: 'bg-ink text-white border border-ink',
    match: 'bg-rose-light text-rose-clay border border-rose-clay/30 font-semibold shadow-subtle',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    error: 'bg-rose-50 text-rose-800 border border-rose-200',
    info: 'bg-blue-50 text-blue-800 border border-blue-200',
    demo: 'bg-purple-50 text-purple-800 border border-purple-200',
  };

  // If score is passed, format as GlowMatch score
  if (score !== undefined) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-pill ${variants.match} ${sizeStyles[size]} ${className}`}
      >
        <Sparkles className="w-3 h-3 text-rose-clay animate-pulse" />
        <span>{score}% Match</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-pill ${variants[variant] || variants.sand} ${sizeStyles[size]} ${className}`}
    >
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      <span>{children}</span>
    </span>
  );
}

export default Badge;
