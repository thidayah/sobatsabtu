'use client';

import { Icon } from '@iconify/react';
import { forwardRef, InputHTMLAttributes, useRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', type = 'text', onClick, onFocus, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
      if (type === 'date') {
        // Trigger native date picker
        if (inputRef.current) {
          //@ts-ignore
          inputRef?.current?.showPicker?.();
        }
      }
      onClick?.(e);
    };

    // const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    //   if (type === 'date') {
    //     // Trigger native date picker on focus
    //     if (inputRef.current) {
    //       //@ts-ignore
    //       inputRef.current.showPicker?.();
    //     }
    //   }
    //   // onFocus?.(e);
    // };

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
            ref={(node) => {
              // Handle both forwarded ref and internal ref
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
              inputRef.current = node;
            }}
            type={type}
            onClick={handleClick}
            // onFocus={handleFocus}
            className={`w-full px-4 py-2.5 bg-white dark:bg-gray-900 border ${error ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} focus:outline-none focus:ring-2 focus:ring-sobat-blue dark:focus:ring-sobat-yellow transition-all ${icon ? 'pl-11' : ''} ${type === 'date' ? 'cursor-pointer' : ''
              } ${className}`}
            {...props}
          />
          {type === 'date' && (
            <Icon
              icon="lucide:calendar"
              width="18"
              height="18"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          )}
        </div>
        {error && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';