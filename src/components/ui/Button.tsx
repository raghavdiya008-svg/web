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
      'inline-flex items-center justify-center font-mono uppercase tracking-wider rounded-[2px] transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00FF41] focus-visible:ring-offset-1 focus-visible:ring-offset-[#0A0A0C] disabled:opacity-40 disabled:cursor-not-allowed active:translate-y-0.5 cursor-pointer shadow-hardware-bevel';

    const variants: Record<string, string> = {
      primary:
        'bg-[#00FF41] text-[#0A0A0C] hover:bg-[#00FF41]/90 font-bold border border-[#00FF41] shadow-[0_0_12px_rgba(0,255,65,0.25)]',
      outline:
        'border border-[#2A2A2C] bg-[#111114] text-[#F5F5F5] hover:border-[#3E3E44] hover:bg-[#18181D]',
      ghost:
        'text-[#8A8A8E] hover:bg-[#18181D] hover:text-[#F5F5F5] border border-transparent shadow-none',
      danger:
        'border border-[#FF3333]/50 text-[#FF3333] bg-[#1A0A0C] hover:bg-[#FF3333]/20',
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