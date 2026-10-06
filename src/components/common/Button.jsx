import React from 'react';
import { Loader2 } from 'lucide-react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon,
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-clay/20 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-ink text-white hover:bg-rose-clay active:bg-rose-dark disabled:bg-sand-dark disabled:text-taupe shadow-subtle',
    secondary: 'bg-transparent text-ink border border-ink hover:bg-ink hover:text-white disabled:border-sand disabled:text-taupe',
    accent: 'bg-rose-clay text-white hover:bg-rose-dark shadow-subtle hover:shadow-card',
    outline: 'bg-transparent text-ink border border-sand hover:border-ink hover:bg-ivory-50',
    ghost: 'bg-transparent text-taupe hover:text-ink hover:bg-sand/30',
    danger: 'bg-status-error text-white hover:bg-red-700',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 rounded-luxury gap-1.5',
    md: 'text-sm px-5 py-2.5 rounded-subtle gap-2',
    lg: 'text-base px-6 py-3 rounded-subtle gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      <span>{children}</span>
    </button>
  );
}

export default Button;
