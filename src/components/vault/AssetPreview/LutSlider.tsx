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
        'metal-chassis overflow-hidden select-none border border-[#2A2A2C] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_16px_rgba(0,0,0,0.85)]',
        className
      )}
    >
      {/* CHASSIS HEADER */}
      <div className="stamped-metal-badge px-3 py-2 flex items-center justify-between border-b border-[#2A2A2C]">
        <div className="flex items-center gap-2">
          <span className="rivet" />
          <span className="font-mono text-[9px] font-black text-[#F5F5F5] tracking-[0.18em] uppercase">
            LUT COLOR ENGINE // CANISTER #03
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[8px] text-[#FF9E1B] uppercase tracking-wider font-bold">
            33x33x33 3D CUBE
          </span>
          <span className="rivet" />
        </div>
      </div>

      {/* INTERACTIVE COMPARISON SCREEN */}
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
        className="relative aspect-video w-full bg-[#050507] overflow-hidden cursor-ew-resize group/lut focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
      >
        {/* BASE LAYER: FLAT UNGRADED LOG STILL (S-LOG3 / ARRI RAW) */}
        <div className="absolute inset-0 w-full h-full">
          {beforeUrl ? (
            <img
              src={beforeUrl}
              alt="Flat Log Preview"
              className="w-full h-full object-cover pointer-events-none"
              style={{ filter: 'saturate(0.35) contrast(0.65) brightness(1.15)' }}
            />
          ) : (
            /* HIGH RESOLUTION PROCEDURAL CINEMATIC SCENE STILL */
            <div
              className="w-full h-full flex flex-col justify-between p-6 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at 70% 30%, #4A4A52 0%, #2A2A30 40%, #141418 80%, #0A0A0C 100%)',
                filter: 'saturate(0.35) contrast(0.68) brightness(1.1)',
              }}
            >
              <div className="w-48 h-32 rounded bg-gradient-to-tr from-[#25252A] to-[#3E3E48] opacity-60 border border-white/5" />
            </div>
          )}
        </div>

        {/* TOP LAYER: GRADED STILL WITH CSS CLIP-PATH */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          {afterUrl ? (
            <img
              src={afterUrl}
              alt="Graded LUT Preview"
              className="w-full h-full object-cover lut-graded pointer-events-none"
            />
          ) : (
            <div
              className="w-full h-full flex flex-col justify-between p-6 lut-graded pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at 70% 30%, #D4883B 0%, #87411E 40%, #1B352E 80%, #080D0B 100%)',
              }}
            >
              <div className="w-48 h-32 rounded bg-gradient-to-tr from-[#5E2B0C] to-[#C97828] opacity-80 border border-amber-500/20" />
            </div>
          )}
        </div>

        {/* RETICLE OVERLAY & FILM SPROCKET TICKS */}
        <div className="absolute inset-0 bg-dot-matrix-fine opacity-20 pointer-events-none" />
        <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#8A8A8E]/60 pointer-events-none" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#8A8A8E]/60 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#8A8A8E]/60 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#8A8A8E]/60 pointer-events-none" />

        {/* DYNAMIC TOP BADGE (FLIPPING OR HIGHLIGHTING MIDPOINT) */}
        <div className="absolute top-3 left-3 z-10 pointer-events-none">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#0A0A0C]/90 border border-[#2A2A2C] font-mono text-[8px] tracking-[0.14em] uppercase backdrop-blur-sm shadow-sm">
            <span className={cn('font-bold', position > 50 ? 'text-[#8A8A8E]' : 'text-[#F5F5F5]')}>
              FLAT LOG / S-LOG3
            </span>
            <span className="text-[#3E3E44]">|</span>
            <span className={cn('font-bold', position <= 50 ? 'text-[#8A8A8E]' : 'text-[#FFB000]')}>
              KODAK 5219 GRADE ▶
            </span>
          </div>
        </div>

        {/* DRAG DIVIDER LINE & RIVET HANDLE */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-[#F5F5F5] pointer-events-none shadow-[0_0_10px_rgba(255,255,255,0.8)] z-20"
          style={{ left: `${position}%` }}
        >
          {/* HARDWARE HANDLE WITH RIVET HEAD */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-9 bg-[#18181D] border border-[#F5F5F5] flex flex-col items-center justify-center gap-1 shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
            <span className="rivet" />
            <SlidersHorizontal size={10} className="text-[#F5F5F5]" />
            <span className="rivet" />
          </div>
        </div>
      </div>

      {/* CHASSIS FOOTER WITH HARDWARE ATTRIBUTION BADGE */}
      <div className="px-3.5 py-2.5 bg-[#0D0D11] border-t border-[#2A2A2C] flex flex-wrap items-center justify-between gap-2">
        <div className="font-mono text-[8px] text-[#8A8A8E] uppercase tracking-wider">
          SPLIT: {position}% | 14-STOP DYNAMIC RANGE PRESERVED
        </div>
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#141418] border border-[#2A2A2C] font-mono text-[8px] text-[#FFB000] font-bold uppercase tracking-wider">
          <span className="led-amber" />
          <span>⚡ GRADED WITH EDITX LUT CANISTER #03 — KODAK 5219 500T EMULATION</span>
        </div>
      </div>
    </div>
  );
}