'use client';
import { forwardRef, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'border border-border bg-suite-deep px-3 py-2 rounded-[2px] w-full text-paper font-mono text-xs placeholder:text-paper-muted/60 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-paper focus-visible:border-paper disabled:opacity-40 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';