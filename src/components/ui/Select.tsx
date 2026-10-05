'use client';
import { forwardRef, SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'border border-border bg-suite-deep px-3 py-2 rounded-[2px] w-full text-paper font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-paper focus-visible:border-paper disabled:opacity-40 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = 'Select';