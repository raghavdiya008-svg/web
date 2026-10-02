'use client';
import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'featured';
  interactive?: boolean;
  children?: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { className, variant = 'default', interactive = false, children, ...props },
    ref
  ) => {
    const base = 'bg-[#111111] border border-[#1A1A1A] rounded-[2px]';
    const variantStyles: Record<string, string> = {
      default: '',
      featured: 'border-[#06B6D4]/30',
    };
    const interactiveStyle = interactive
      ? 'transition-all duration-300 hover:border-[#06B6D4]/40 cursor-pointer'
      : '';

    return (
      <div
        ref={ref}
        className={cn(base, variantStyles[variant], interactiveStyle, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';