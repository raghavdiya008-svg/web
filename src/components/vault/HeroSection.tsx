'use client';
import { useState, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { Play, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { HeroBackground } from './HeroBackground';

interface HeroSectionProps {
  totalUsers: number;
  totalDrops: number;
}

export function HeroSection({ totalUsers, totalDrops }: HeroSectionProps) {
  const prefersReduced = useReducedMotion();
  const [vuLevels, setVuLevels] = useState<number[]>([
    45, 62, 78, 54, 88, 70, 92, 60, 48, 76, 82, 58, 65, 84, 91, 52
  ]);
  const [peakLevels, setPeakLevels] = useState<number[]>([
    50, 68, 82, 60, 92, 75, 96, 65, 52, 80, 86, 62, 70, 88, 95, 58
  ]);

  useEffect(() => {
    if (prefersReduced) return;

    let animId: number;
    let lastTick = performance.now();

    const loop = (time: number) => {
      if (time - lastTick >= 140) {
        lastTick = time;
        setVuLevels((prev) => {
          const next = prev.map((val) => {
            const delta = (Math.random() - 0.5) * 26;
            return Math.max(12, Math.min(98, Math.round(val + delta)));
          });

          setPeakLevels((prevPeaks) =>
            prevPeaks.map((peak, idx) => {
              const current = next[idx];
              if (current >= peak) return current;
              return Math.max(12, Math.round(peak - 1.8));
            })
          );

          return next;
        });
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [prefersReduced]);

  const [editionString, setEditionString] = useState('2026.10');
  useEffect(() => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    setEditionString(`${d.getFullYear()}.${mm}`);
  }, []);

  return (
    <section className="relative flex flex-col justify-between border-b border-border overflow-hidden bg-background transition-colors duration-200">
      <HeroBackground />

      <div className="absolute top-0 right-1/4 w-[400px] h-[300px] bg-white/[0.015] blur-[120px] pointer-events-none" />

      <div className="relative max-w-[1280px] mx-auto px-5 lg:px-8 pt-8 pb-10 sm:pt-12 sm:pb-12 flex-1 flex flex-col justify-center z-10">
        
        <div className="mb-8">
          <div className="inline-flex items-center gap-3 px-3 py-1.5 bg-surface border border-border shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-mono text-[12px] tracking-[0.2em] text-muted uppercase font-semibold">
              INDEX // DAILY PRODUCTION ASSETS
            </span>
            <span className="text-border">/</span>
            <span className="font-mono text-[12px] text-primary tracking-[0.16em] uppercase font-bold">
              EDITION {editionString}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-accent" />
                <span className="font-mono text-[12px] tracking-[0.25em] text-muted uppercase font-bold">
                  PRECISION REPOSITORY // ZERO PAYWALLS
                </span>
              </div>
              <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-primary tracking-tight leading-[0.92] text-balance">
                PRECISION<br />
                TOOLS FOR<br />
                <span className="text-muted">CREATORS.</span>
              </h1>
            </div>

            <p className="text-base sm:text-lg text-muted max-w-xl leading-relaxed text-pretty font-body font-normal">
              Curated analog audio stems, 35mm film grains, color-science LUTs, and motion geometry packs.
              Open-source licenses for editors, animators, and sound designers.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/today"
                className="px-8 py-4 bg-primary text-black font-mono text-[13px] font-black uppercase tracking-[0.18em] border border-transparent hover:opacity-90 active:scale-95 transition-all inline-flex items-center gap-2.5 shadow-sm focus-visible:ring-1 focus-visible:ring-current"
              >
                <Play size={14} className="fill-current" />
                ACCESS TODAY&apos;S DROP
              </Link>

              <Link
                href="/vault"
                className="px-8 py-4 bg-surface text-primary font-mono text-[13px] font-bold uppercase tracking-[0.18em] border border-border hover:border-primary hover:bg-surface-elevated transition-all inline-flex items-center gap-2 shadow-sm focus-visible:ring-1 focus-visible:ring-current"
              >
                ARCHIVE REEL
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between hidden sm:flex">
            <div className="metal-chassis p-6 space-y-5 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary" />
                  <span className="font-mono text-[12px] font-bold text-primary tracking-[0.2em] uppercase">
                    AUDIO TELEMETRY
                  </span>
                </div>
                <span className="font-mono text-[12px] text-muted uppercase tracking-[0.16em]">
                  48kHz / 24-BIT
                </span>
              </div>

              <div className="p-4 bg-background border border-border space-y-3 flex-1 flex flex-col justify-between min-h-[140px] rounded-[2px]">
                <div className="flex items-center justify-between text-[12px] font-mono text-muted uppercase tracking-[0.18em]">
                  <span>SPECTRUM [20Hz - 22kHz]</span>
                  <span className="text-accent font-bold">LIVE SIGNAL</span>
                </div>

                <div className="h-28 flex items-end gap-1.5 px-1 bg-surface border border-border p-2 relative rounded-[1px]">
                  {vuLevels.map((lvl, idx) => {
                    const peak = peakLevels[idx] || lvl;
                    const isPeak = lvl > 85;
                    const isMid = lvl > 60;
                    return (
                      <div key={idx} className="flex-1 flex flex-col justify-end h-full relative">
                        <div
                          className="absolute w-full h-[1.5px] bg-primary transition-all duration-100 z-10"
                          style={{ bottom: `${peak}%` }}
                        />
                        <div
                          className={cn(
                            'w-full transition-all duration-100 ease-out',
                            isPeak ? 'bg-accent' : isMid ? 'bg-primary' : 'bg-border'
                          )}
                          style={{ height: `${lvl}%` }}
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between font-mono text-[10px] text-muted uppercase tracking-wider">
                  <span>-48dB</span>
                  <span>-24dB</span>
                  <span>-12dB</span>
                  <span className="text-primary font-bold">0dB</span>
                  <span className="text-accent font-bold">+3dB</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border text-[12px] font-mono text-muted">
                <span className="tracking-[0.16em] uppercase">SMPTE TIMECODE SYNCED</span>
                <span className="tracking-[0.16em] uppercase text-accent font-bold">ACTIVE BUS</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-wrap items-center justify-between gap-6 font-mono text-[12px]">
          <div className="flex items-center gap-6 text-muted">
            <div className="flex items-center gap-2">
              <span className="text-primary font-bold uppercase tracking-wider">
                {totalDrops > 0 ? totalDrops : 3} PACKS · 100% FREE
              </span>
            </div>
            <span className="text-border">/</span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-primary font-bold uppercase tracking-wider">
                14:00 UTC DAILY DROP
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[12px] text-muted tracking-widest uppercase">
            <span>STUDIO HARDWARE PIPELINE</span>
            <span className="text-green-500">● ONLINE</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-3 right-4 z-20 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1 bg-surface border border-border font-mono text-[12px] text-muted uppercase tracking-wider">
        <span className="w-1.5 h-1.5 bg-primary" />
        <span>SYSTEM VERSION {editionString}</span>
      </div>
    </section>
  );
}
