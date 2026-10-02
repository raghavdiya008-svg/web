'use client';
import { useState, useEffect } from 'react';
import { useLottie } from 'lottie-react';
import { Code, Eye, Layers } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { playClick, playHoverTick } from '@/lib/audio/soundFx';

const PRESETS = [
  { id: 'lower-third', label: 'LOWER THIRD', path: '/lottie/lower-third.json' },
  { id: 'kinetic-text', label: 'KINETIC TEXT', path: '/lottie/kinetic-text.json' },
  { id: 'minimal-loader', label: 'RADAR LOADER', path: '/lottie/minimal-loader.json' },
];

interface LottiePreviewProps {
  animationUrl?: string;
  className?: string;
  width?: number;
  height?: number;
}

export function LottiePreview({
  animationUrl = '/lottie/minimal-loader.json',
  className,
  width = 240,
  height = 200,
}: LottiePreviewProps) {
  const [activeTab, setActiveTab] = useState(PRESETS[0].id);
  const [animData, setAnimData] = useState<any>(null);
  const [showCode, setShowCode] = useState(false);

  const currentPath = PRESETS.find((p) => p.id === activeTab)?.path || animationUrl;

  useEffect(() => {
    const controller = new AbortController();
    fetch(currentPath, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        setAnimData(data);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.warn('Lottie load failed:', err);
        }
      });
    return () => {
      controller.abort();
    };
  }, [currentPath]);

  const { View } = useLottie(
    {
      animationData: animData,
      loop: true,
      autoplay: true,
    },
    { width: '100%', height: '100%' }
  );

  return (
    <div
      className={cn(
        'metal-chassis overflow-hidden border border-[#2A2A2C] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_16px_rgba(0,0,0,0.85)]',
        className
      )}
    >
      {/* TABS BAR (STAMPED METAL BADGE STYLING) */}
      <div className="stamped-metal-badge p-2 flex flex-wrap items-center justify-between gap-2 border-b border-[#2A2A2C]">
        <div className="flex items-center gap-1.5">
          <span className="rivet" />
          <span className="font-mono text-[9px] font-extrabold text-[#F5F5F5] uppercase tracking-[0.16em]">
            LOTTIE KINETICS // ENGINE-04
          </span>
        </div>

        {/* PRESET SWITCHER TABS */}
        <div className="flex items-center gap-1 bg-[#0A0A0C] p-0.5 border border-[#2A2A2C]">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                playClick();
                setActiveTab(preset.id);
              }}
              onMouseEnter={() => playHoverTick()}
              className={cn(
                'px-2.5 py-1 font-mono text-[8px] font-bold uppercase tracking-wider transition-all',
                activeTab === preset.id
                  ? 'bg-[#222228] text-[#FF9E1B] border border-[#FF9E1B]/50 shadow-sm'
                  : 'text-[#8A8A8E] hover:text-[#F5F5F5]'
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* CODE / PREVIEW TOGGLE */}
        <button
          onClick={() => {
            playClick();
            setShowCode(!showCode);
          }}
          onMouseEnter={() => playHoverTick()}
          className="flex items-center gap-1 px-2 py-1 bg-[#141418] border border-[#2A2A2C] font-mono text-[8px] text-[#8A8A8E] hover:text-[#F5F5F5] uppercase"
        >
          {showCode ? <Eye size={10} /> : <Code size={10} />}
          <span>{showCode ? 'VIEW RENDER' : 'RAW JSON'}</span>
        </button>
      </div>

      {/* DISPLAY SCREEN WITH LED SEGMENT STYLING */}
      <div className="relative min-h-[200px] bg-[#060608] led-segment-display flex items-center justify-center p-6 overflow-hidden">
        {/* DOT MATRIX BACKGROUND */}
        <div className="absolute inset-0 bg-dot-matrix-fine opacity-25 pointer-events-none" />

        {showCode ? (
          /* RAW JSON CODE PREVIEW MONOSPACE BLOCK */
          <div className="w-full h-48 overflow-auto font-mono text-[9px] text-[#FF9E1B] bg-[#030304] p-3 border border-[#1E1E22] leading-relaxed selection:bg-[#FF9E1B]/20">
            <pre className="whitespace-pre-wrap">
              {animData ? JSON.stringify(animData, null, 2).slice(0, 1200) + '\n... [TRUNCATED RAW LOTTIE NODES]' : 'Loading Lottie payload...'}
            </pre>
          </div>
        ) : (
          /* LIVE LOTTIE RENDER VIEW */
          <div className="w-48 h-48 flex items-center justify-center relative z-10">
            {animData ? View : <span className="font-mono text-[9px] text-[#8A8A8E]">LOADING VECTORS...</span>}
          </div>
        )}

        {/* SCANLINE / FRAME TICKS */}
        <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-[#8A8A8E]/60 pointer-events-none" />
        <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-[#8A8A8E]/60 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l border-[#8A8A8E]/60 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-[#8A8A8E]/60 pointer-events-none" />
      </div>

      {/* ATTRIBUTION FOOTER BADGE */}
      <div className="px-3 py-2 bg-[#0D0D11] border-t border-[#2A2A2C] flex items-center justify-between text-[8px] font-mono text-[#8A8A8E]">
        <span>60 FPS VECTOR KINETICS · ZERO RASTER PIXELS</span>
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#141418] border border-[#2A2A2C] text-[#FF9E1B] font-bold uppercase">
          <span className="led-amber animate-pulse" />
          <span>⚡ POWERED BY EDITX LOTTIE KINETICS PACK</span>
        </div>
      </div>
    </div>
  );
}