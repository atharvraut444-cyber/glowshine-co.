import React from 'react';

export function Card({
  children,
  className = '',
  variant = 'surface',
  onClick,
  ...props
}) {
  const variants = {
    surface: 'surface-card rounded-card p-5',
    elevated: 'surface-elevated rounded-card p-6',
    ivory: 'bg-ivory border border-sand rounded-card p-5',
    minimal: 'bg-white border border-sand/60 rounded-subtle p-4',
  };

  return (
    <div
      onClick={onClick}
      className={`${variants[variant] || variants.surface} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
