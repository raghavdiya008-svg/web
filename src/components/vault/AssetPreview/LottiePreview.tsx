'use client';
import { useState, useEffect } from 'react';
import { useLottie } from 'lottie-react';
import { Code, Eye } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { playClick, playHoverTick } from '@/lib/audio/soundFx';
import { useReducedMotion } from 'framer-motion';

const PRESETS = [
  { id: 'lower-third', label: 'LOWER THIRD', path: '/lottie/lower-third.json' },
  { id: 'kinetic-text', label: 'KINETIC TEXT', path: '/lottie/kinetic-text.json' },
  { id: 'minimal-loader', label: 'RADAR LOADER', path: '/lottie/minimal-loader.json' },
];

interface LottiePreviewProps {
  animationUrl?: string;
  className?: string;
}

export function LottiePreview({
  animationUrl = '/lottie/minimal-loader.json',
  className,
}: LottiePreviewProps) {
  const [activeTab, setActiveTab] = useState(PRESETS[0].id);
  const [animData, setAnimData] = useState<any>(null);
  const [showCode, setShowCode] = useState(false);
  const prefersReduced = useReducedMotion();

  const currentPath = PRESETS.find((p) => p.id === activeTab)?.path || animationUrl;

  useEffect(() => {
    setAnimData(null);
    const controller = new AbortController();
    fetch(currentPath, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => setAnimData(data))
      .catch((err) => {
        if (err.name !== 'AbortError') console.warn('Lottie load failed:', err);
      });
    return () => controller.abort();
  }, [currentPath]);

  const { View } = useLottie(
    {
      animationData: animData,
      loop: !prefersReduced,
      autoplay: !prefersReduced,
    },
    { width: '100%', height: '100%' }
  );

  return (
    <div className={cn('metal-chassis overflow-hidden border border-border', className)}>
      <div className="p-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface-elevated">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[12px] font-bold text-primary uppercase tracking-wider">
            VECTOR MOTION · LOTTIE PREVIEW
          </span>
        </div>

        <div className="flex items-center gap-1 bg-background p-0.5 border border-border">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => { playClick(); setActiveTab(preset.id); }}
              onMouseEnter={() => playHoverTick()}
              className={cn(
                'px-2.5 py-1 font-mono text-[12px] font-bold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
                activeTab === preset.id
                  ? 'bg-accent/10 text-accent border border-accent shadow-sm'
                  : 'text-muted hover:text-primary'
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => { playClick(); setShowCode(!showCode); }}
          onMouseEnter={() => playHoverTick()}
          className="flex items-center gap-1 px-2 py-1 bg-background border border-border font-mono text-[12px] text-muted hover:text-primary uppercase focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
        >
          {showCode ? <Eye size={12} /> : <Code size={12} />}
          <span>{showCode ? 'VIEW RENDER' : 'RAW JSON'}</span>
        </button>
      </div>

      <div className="relative min-h-[200px] bg-background flex items-center justify-center p-6 overflow-hidden">
        <div className="absolute inset-0 bg-dot-matrix-fine opacity-25 pointer-events-none" />

        {showCode ? (
          <div className="w-full h-48 overflow-auto font-mono text-[12px] text-accent bg-[#030304] p-3 border border-border leading-relaxed">
            <pre className="whitespace-pre-wrap">
              {animData ? JSON.stringify(animData, null, 2).slice(0, 1200) + '\n... [TRUNCATED RAW LOTTIE NODES]' : 'Loading Lottie payload...'}
            </pre>
          </div>
        ) : (
          <div className="w-48 h-48 flex items-center justify-center relative z-10">
            {animData ? (
              View
            ) : (
              <div className="w-full h-full border-2 border-dashed border-border rounded-full animate-spin [animation-duration:3s] flex items-center justify-center">
                <div className="w-1/2 h-1/2 bg-muted/20 rounded-full animate-pulse" />
              </div>
            )}
          </div>
        )}

        <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-muted/60 pointer-events-none" />
        <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-muted/60 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l border-muted/60 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-muted/60 pointer-events-none" />
      </div>

      <div className="px-3 py-2 bg-surface-elevated border-t border-border flex flex-col md:flex-row md:items-center justify-between text-[12px] font-mono text-muted gap-2">
        <span>60 FPS VECTOR KINETICS · ZERO RASTER PIXELS</span>
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-background border border-border text-accent font-bold uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span>⚡ LOTTIE KINETICS PACK</span>
        </div>
      </div>
    </div>
  );
}