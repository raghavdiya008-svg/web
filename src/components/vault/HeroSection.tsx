'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { Play, ArrowRight } from 'lucide-react';
import { MagneticButton } from '@/components/ui/MagneticButton';

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

  // Real-time audio spectrum movement
  useEffect(() => {
    const interval = setInterval(() => {
      setVuLevels((prev) =>
        prev.map((val) => {
          const delta = (Math.random() - 0.5) * 26;
          return Math.max(12, Math.min(98, Math.round(val + delta)));
        })
      );
    }, 140);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative flex flex-col justify-between border-b border-[#1F1F24] overflow-hidden bg-[#070708]">
      {/* CAD BLUEPRINT & TELEMETRY VIEWPORT */}
      <HeroBackground />

      {/* AMBIENT LIGHT FIELD */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[300px] bg-white/[0.015] blur-[120px] pointer-events-none" />

      <div className="relative max-w-[1280px] mx-auto px-5 lg:px-8 pt-8 pb-10 sm:pt-12 sm:pb-12 flex-1 flex flex-col justify-center z-10">
        
        {/* TOP STATUS BAR */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-3 px-3 py-1.5 bg-[#0E0E11] border border-[#1F1F24]">
            <span className="w-2 h-2 rounded-full bg-[#FFFFFF] animate-pulse" />
            <span className="font-mono text-[9px] tracking-[0.2em] text-[#A1A1AA] uppercase font-semibold">
              INDEX // DAILY PRODUCTION ASSETS
            </span>
            <span className="text-[#27272A]">/</span>
            <span className="font-mono text-[9px] text-[#FFFFFF] tracking-[0.16em] uppercase font-bold">
              EDITION 2026.10
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* LEFT 7 COLS — SWISS BRUTALIST HEADLINE & MANIFESTO */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#FF4400]" />
                <span className="font-mono text-[10px] tracking-[0.3em] text-[#A1A1AA] uppercase font-bold">
                  CURATED REPOSITORY FOR EDITORS & 3D ARTISTS
                </span>
              </div>
              <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#FFFFFF] uppercase tracking-[-0.045em] leading-[0.88] text-balance">
                PRECISION<br />
                TOOLS FOR<br />
                <span className="text-[#A1A1AA]">CREATORS.</span>
              </h1>
            </div>

            <p className="text-base sm:text-lg text-[#A1A1AA] max-w-xl leading-relaxed text-pretty font-body font-normal">
              Tactile audio stems, 35mm film grains, color-science LUTs, and motion geometry packs.
              Zero friction, zero paywalls. Published daily at 14:00 UTC.
            </p>

            {/* ACTION TRIGGERS: HIGH CONTRAST INVERTED BUTTONS */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/today">
                <MagneticButton className="px-8 py-4 bg-[#FFFFFF] text-[#000000] font-mono text-xs font-black uppercase tracking-[0.18em] border border-[#FFFFFF] hover:bg-[#E4E4E7] active:scale-95 transition-all flex items-center gap-2.5">
                  <Play size={12} className="fill-current" />
                  ACCESS TODAY'S DROP
                </MagneticButton>
              </Link>

              <Link href="/vault">
                <MagneticButton className="px-8 py-4 bg-[#0E0E11] text-[#FFFFFF] font-mono text-xs font-bold uppercase tracking-[0.18em] border border-[#27272A] hover:border-[#FFFFFF] hover:bg-[#18181B] transition-all flex items-center gap-2">
                  ARCHIVE REEL
                  <ArrowRight size={13} />
                </MagneticButton>
              </Link>
            </div>

          </div>

          {/* RIGHT 5 COLS — HIGH-CONTRAST SPECTRUM & AUDIO TELEMETRY UNIT */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="metal-chassis p-6 space-y-5 h-full flex flex-col justify-between">
              
              {/* UNIT HEADER */}
              <div className="flex items-center justify-between pb-3 border-b border-[#1F1F24]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#FFFFFF]" />
                  <span className="font-mono text-[9px] font-extrabold text-[#FFFFFF] tracking-[0.22em] uppercase">
                    CHANNEL MONITOR // NO. 01
                  </span>
                </div>
                <span className="font-mono text-[8px] text-[#A1A1AA] uppercase tracking-[0.16em]">
                  48kHz / 24-BIT
                </span>
              </div>

              {/* LIVE TAPE STATUS */}
              <div className="p-3.5 bg-[#070708] border border-[#1F1F24] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#FF4400] animate-pulse" />
                  <div className="flex flex-col">
                    <span className="font-mono text-[9px] font-black text-[#FFFFFF] tracking-[0.18em] uppercase">
                      SIGNAL BUS: CALIBRATED
                    </span>
                    <span className="font-mono text-[8px] text-[#A1A1AA] tracking-[0.14em] uppercase">
                      STUDIO REFERENCE DECK · 30 IPS
                    </span>
                  </div>
                </div>
                <div className="font-mono text-[10px] text-[#FFFFFF] bg-[#141417] px-2.5 py-1 border border-[#27272A] font-bold">
                  +0.0 dB
                </div>
              </div>

              {/* REAL-TIME VU SPECTRUM */}
              <div className="p-4 bg-[#070708] border border-[#1F1F24] space-y-2 flex-1 flex flex-col justify-between min-h-[140px]">
                <div className="flex items-center justify-between text-[8px] font-mono text-[#52525B] uppercase tracking-[0.18em] pb-1">
                  <span>SPECTRUM ANALYZER [20Hz - 22kHz]</span>
                  <span className="text-[#FFFFFF] font-bold">PEAK HOLD</span>
                </div>

                <div className="h-28 flex items-end gap-1.5 px-1 bg-[#050506] border border-[#16161A] p-2">
                  {vuLevels.map((lvl, idx) => {
                    const isPeak = lvl > 85;
                    const isMid = lvl > 60;
                    return (
                      <div key={idx} className="flex-1 flex flex-col justify-end h-full">
                        <div
                          className="w-full transition-all duration-100 ease-out"
                          style={{
                            height: `${lvl}%`,
                            backgroundColor: isPeak ? '#FF4400' : isMid ? '#FFFFFF' : '#52525B',
                          }}
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between font-mono text-[7px] text-[#52525B] uppercase tracking-wider pt-1">
                  <span>-48dB</span>
                  <span>-24dB</span>
                  <span>-12dB</span>
                  <span>-6dB</span>
                  <span className="text-[#FFFFFF]">0dB</span>
                  <span className="text-[#FF4400]">+3dB</span>
                </div>
              </div>

              {/* RACK UNIT FOOTER */}
              <div className="flex items-center justify-between pt-2 border-t border-[#1F1F24] text-[8px] font-mono text-[#A1A1AA]">
                <span className="tracking-[0.16em] uppercase">SMPTE TIMECODE SYNCED</span>
                <span className="tracking-[0.16em] uppercase text-[#FFFFFF] font-bold">ACTIVE BUS</span>
              </div>

            </div>
          </div>

        </div>

        {/* ============================================================
            HIGH-CONTRAST SWISS STATS GRID (CLEAN ASYMMETRIC BORDERS)
            ============================================================ */}
        <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-0 border border-[#1F1F24] divide-y md:divide-y-0 md:divide-x divide-[#1F1F24] bg-[#0E0E11]">
          
          {/* STAT 1: STORED ASSETS */}
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] tracking-[0.22em] text-[#A1A1AA] uppercase font-bold">
                01 // ARCHIVED PACKS
              </span>
              <span className="w-1.5 h-1.5 bg-[#FFFFFF]" />
            </div>
            <div className="py-1 flex items-baseline gap-2">
              <span className="font-mono text-5xl sm:text-6xl lg:text-7xl font-black text-[#FFFFFF] tracking-tight tabular-nums">
                {totalDrops > 0 ? totalDrops : 48}
              </span>
              <span className="font-mono text-3xl font-extrabold text-[#71717A]">
                +
              </span>
            </div>
            <div className="pt-3 border-t border-[#1F1F24] flex items-center justify-between font-mono text-[8px] text-[#71717A] uppercase tracking-[0.16em]">
              <span>STATUS: UNLOCKED</span>
              <span className="text-[#FFFFFF]">100% FREE</span>
            </div>
          </div>

          {/* STAT 2: ACTIVE OPERATORS */}
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] tracking-[0.22em] text-[#A1A1AA] uppercase font-bold">
                02 // CREATORS ACTIVE
              </span>
              <span className="w-1.5 h-1.5 bg-[#FFFFFF] animate-pulse" />
            </div>
            <div className="py-1 flex items-baseline gap-1">
              <span className="font-mono text-5xl sm:text-6xl lg:text-7xl font-black text-[#FFFFFF] tracking-tight tabular-nums">
                {totalUsers.toLocaleString()}
              </span>
            </div>
            <div className="pt-3 border-t border-[#1F1F24] flex items-center justify-between font-mono text-[8px] text-[#71717A] uppercase tracking-[0.16em]">
              <span>COMMUNITY OPERATORS</span>
              <span className="text-[#FFFFFF]">ONLINE</span>
            </div>
          </div>

          {/* STAT 3: DROP CLOCK */}
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] tracking-[0.22em] text-[#A1A1AA] uppercase font-bold">
                03 // DAILY CADENCE
              </span>
              <span className="w-1.5 h-1.5 bg-[#FF4400]" />
            </div>
            <div className="py-1 flex items-baseline gap-1">
              <span className="font-mono text-5xl sm:text-6xl lg:text-7xl font-black text-[#FFFFFF] tracking-tight tabular-nums">
                14:00
              </span>
            </div>
            <div className="pt-3 border-t border-[#1F1F24] flex items-center justify-between font-mono text-[8px] text-[#71717A] uppercase tracking-[0.16em]">
              <span>SYNCHRONIZED RELEASE</span>
              <span className="text-[#FF4400]">UTC DAILY</span>
            </div>
          </div>

        </div>

      </div>

      {/* ASSET SYSTEM WATERMARK BADGE */}
      <div className="absolute bottom-3 right-4 z-20 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1 bg-[#0E0E11] border border-[#1F1F24] font-mono text-[9px] text-[#A1A1AA] uppercase tracking-wider">
        <span className="w-1.5 h-1.5 bg-[#FFFFFF]" />
        <span>SYSTEM VERSION 2026.10</span>
      </div>
    </section>
  );
}
