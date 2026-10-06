import React, { forwardRef } from 'react';

export const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    id,
    type = 'text',
    className = '',
    required = false,
    ...props
  },
  ref
) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold tracking-wider uppercase text-ink"
        >
          {label} {required && <span className="text-rose-clay">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={type}
          required={required}
          className={`w-full px-3.5 py-2.5 bg-white border ${
            error ? 'border-status-error focus:ring-status-error/20' : 'border-sand focus:border-ink focus:ring-ink/10'
          } rounded-subtle text-ink text-sm placeholder:text-taupe/60 focus:outline-none focus:ring-2 transition-all duration-150 ${className}`}
          {...props}
        />
      </div>

      {error ? (
        <p className="text-xs text-status-error mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-taupe mt-1">{helperText}</p>
      ) : null}
    </div>
  );
});

export default Input;
