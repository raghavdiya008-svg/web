'use client';
import { useRef, useState, useCallback } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { playHoverTick } from '@/lib/audio/soundFx';

interface LutSliderProps {
  beforeUrl?: string;
  afterUrl?: string;
  className?: string;
  title?: string;
}

export function LutSlider({
  beforeUrl,
  afterUrl,
  className,
  title = 'KODAK 5219 500T CINE EMULATION',
}: LutSliderProps) {
  const [position, setPosition] = useState(52);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const pct = Math.round((x / rect.width) * 100);
    setPosition(pct);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    updatePosition(e.clientX);
    playHoverTick();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging || e.buttons === 1) {
      updatePosition(e.clientX);
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className={cn(
        'metal-chassis overflow-hidden select-none border border-border shadow-md',
        className
      )}
    >
      <div className="px-3.5 py-2.5 flex items-center justify-between border-b border-border bg-surface-elevated">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[12px] font-bold text-primary tracking-wider uppercase">
            COLOR SCIENCE · BEFORE / AFTER PREVIEW
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="font-mono text-[12px] text-accent uppercase tracking-wider font-bold">
            33×33×33 3D .CUBE
          </span>
        </div>
      </div>

      <div
        ref={containerRef}
        role="slider"
        tabIndex={0}
        aria-label="LUT split comparison slider"
        aria-valuenow={position}
        aria-valuemin={0}
        aria-valuemax={100}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            e.preventDefault();
            setPosition((prev) => Math.min(100, prev + 2));
            playHoverTick();
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            e.preventDefault();
            setPosition((prev) => Math.max(0, prev - 2));
            playHoverTick();
          }
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="relative aspect-video w-full bg-background overflow-hidden cursor-ew-resize group/lut focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
      >
        <div className="absolute inset-0 w-full h-full">
          {beforeUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={beforeUrl}
              alt="Flat Log Preview"
              className="w-full h-full object-cover pointer-events-none"
              style={{ filter: 'saturate(0.35) contrast(0.65) brightness(1.15)' }}
            />
          ) : (
            <div
              className="w-full h-full flex flex-col justify-between p-6 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at 70% 30%, #4A4A52 0%, #2A2A30 40%, #141418 80%, #0A0A0C 100%)',
                filter: 'saturate(0.35) contrast(0.68) brightness(1.1)',
              }}
            >
              <div className="w-48 h-32 rounded bg-gradient-to-tr from-[#25252A] to-[#3E3E48] opacity-60 border border-white/5" />
            </div>
          )}
        </div>

        <div
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          {afterUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={afterUrl}
              alt="Graded LUT Preview"
              className="w-full h-full object-cover lut-graded pointer-events-none"
            />
          ) : (
            <div
              className="w-full h-full flex flex-col justify-between p-6 lut-graded pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at 70% 30%, #D4883B 0%, #87411E 40%, #1B352E 80%, #080D0B 100%)',
              }}
            >
              <div className="w-48 h-32 rounded bg-gradient-to-tr from-[#5E2B0C] to-[#C97828] opacity-80 border border-amber-500/20" />
            </div>
          )}
        </div>

        <div className="absolute inset-0 bg-dot-matrix-fine opacity-20 pointer-events-none" />
        <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-muted/60 pointer-events-none" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-muted/60 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-muted/60 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-muted/60 pointer-events-none" />

        <div className="absolute top-3 left-3 z-10 pointer-events-none">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-background/90 border border-border font-mono text-[12px] tracking-wider uppercase backdrop-blur-sm shadow-sm">
            <span className={cn('font-bold', position > 50 ? 'text-muted' : 'text-primary')}>
              LOG
            </span>
            <span className="text-border">|</span>
            <span className={cn('font-bold', position <= 50 ? 'text-muted' : 'text-accent')}>
              5219 ▶
            </span>
          </div>
        </div>

        <div
          className="absolute top-0 bottom-0 w-[2px] bg-primary pointer-events-none shadow-[0_0_10px_rgba(255,255,255,0.8)] z-20"
          style={{ left: `${position}%` }}
        >
          <div className="absolute top-2 -translate-x-1/2 left-1/2 px-1.5 py-0.5 bg-background border border-primary font-mono text-[12px] font-bold text-primary tracking-wider whitespace-nowrap shadow-md">
            {position}%
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-10 bg-surface-elevated border border-primary flex flex-col items-center justify-center gap-1 shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
            <SlidersHorizontal size={14} className="text-primary" />
          </div>
        </div>
      </div>

      <div className="px-3.5 py-2.5 bg-surface border-t border-border flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="font-mono text-[12px] text-muted uppercase tracking-wider">
          SPLIT: {position}% | 14-STOP DYNAMIC RANGE
        </div>
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-background border border-border font-mono text-[12px] text-accent font-bold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span>⚡ GRADED WITH EDITX KODAK 5219</span>
        </div>
      </div>
    </div>
  );
}