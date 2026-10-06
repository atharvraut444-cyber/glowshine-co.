import React from 'react';

export function Skeleton({ className = '', variant = 'rect' }) {
  const variantStyles = {
    rect: 'rounded-subtle',
    circle: 'rounded-full',
    text: 'rounded h-4 w-full',
    badge: 'rounded-pill h-5 w-16',
  };

  return (
    <div
      className={`skeleton-shimmer bg-sand/60 ${variantStyles[variant] || 'rounded-subtle'} ${className}`}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="surface-card rounded-card p-3 flex flex-col gap-3">
      <Skeleton className="w-full aspect-[4/5] rounded-card" />
      <div className="space-y-2 px-1">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-8 w-20 rounded-subtle" />
        </div>
      </div>
    </div>
  );
}

export function KpiCardSkeleton() {
  return (
    <div className="surface-card rounded-card p-5 space-y-3">
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-40" />
    </div>
  );
}

export function TableRowSkeleton({ columns = 5 }) {
  return (
    <tr className="border-b border-sand/40">
      {Array.from({ length: columns }).map((_, idx) => (
        <td key={idx} className="p-4">
          <Skeleton className="h-4 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
}

export default Skeleton;
