'use client';

import { Icon } from '@iconify/react';
import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <Icon
              icon={icon}
              width="18"
              height="18"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
          )}
          <input
            ref={ref}
            className={`w-full px-4 py-2.5 bg-white dark:bg-gray-900 border ${error ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} focus:outline-none focus:ring-2 focus:ring-sobat-blue dark:focus:ring-sobat-yellow transition-all ${icon ? 'pl-11' : ''} ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';