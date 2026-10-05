'use client';
import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { playMechanicalClick } from '@/lib/audio/soundFx';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const base =
      'inline-flex items-center justify-center font-mono uppercase tracking-wider rounded-[2px] transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-paper focus-visible:ring-offset-1 focus-visible:ring-offset-monitor disabled:opacity-40 disabled:cursor-not-allowed active:translate-y-0.5 cursor-pointer';

    const variants: Record<string, string> = {
      primary:
        'bg-paper text-monitor hover:bg-paper-dim font-bold border border-paper shadow-[0_2px_8px_rgba(0,0,0,0.3)]',
      outline:
        'border border-border bg-suite-deep text-paper hover:bg-suite-light/40 hover:border-paper/40',
      ghost:
        'text-paper-muted hover:bg-suite-deep hover:text-paper border border-transparent shadow-none',
      danger:
        'border border-tally/60 text-tally bg-tally/10 hover:bg-tally/20',
    };

    const sizes: Record<string, string> = {
      sm: 'h-7  px-3   text-[10px] gap-1.5',
      md: 'h-9  px-4.5 text-xs     gap-2',
      lg: 'h-11 px-6   text-xs     gap-2.5 font-bold',
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      playMechanicalClick();
      if (onClick) onClick(e);
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        onClick={handleClick}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            width="13"
            height="13"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';