'use client';
import { useState, useRef, useEffect } from 'react';
import { Download, SlidersHorizontal, FileText, Activity, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { formatBytes } from '@/lib/utils/format';
import { playCardHover, playSubThump, isSfxMuted } from '@/lib/audio/soundFx';

interface DropCardProps {
  drop: {
    id: string;
    title: string;
    description?: string;
    file_format?: string;
    file_size?: number;
    license?: string;
    download_count?: number;
    scheduled_for?: string;
    categories?: {
      slug?: string;
      name?: string;
      color?: string;
    };
  };
  session?: unknown;
}

// 1. LUT Category: Drag-to-Compare Before/After Split Slider with Kodak Grade
function LutComparisonPreview() {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const updatePosition = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    setSliderPos(Math.round((x / rect.width) * 100));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging || e.buttons === 1) {
      updatePosition(e.clientX);
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      setSliderPos((prev) => Math.min(100, prev + 5));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      setSliderPos((prev) => Math.max(0, prev - 5));
    }
  };

  return (
    <div
      ref={containerRef}
      role="slider"
      tabIndex={0}
      aria-label="LUT comparison slider"
      aria-valuenow={sliderPos}
      aria-valuemin={0}
      aria-valuemax={100}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className="relative h-32 bg-[#060608] border-b border-[#2A2A2C] overflow-hidden cursor-ew-resize select-none group/lut focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
    >
      {/* BEFORE LAYER: FLAT RAW LOG */}
      <div className="absolute inset-0 bg-[#141418] flex items-end p-2.5">
        <div className="w-full h-full bg-gradient-to-r from-[#1C1C20] via-[#222226] to-[#18181C] flex flex-col justify-end">
          <span className="font-mono text-[7px] font-bold text-[#8A8A8E] bg-[#0A0A0C]/90 px-1 py-0.5 border border-[#2A2A2C] uppercase tracking-wider self-start">
            RAW LOG [ARRI]
          </span>
        </div>
      </div>

      {/* AFTER LAYER: KODAK 500T COLOR EMULATION (CLIPPED) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPos}%` }}
      >
        <div className="w-[320px] sm:w-[380px] h-full bg-gradient-to-r from-[#2A1605] via-[#4A2608] to-[#113123] flex flex-col justify-end p-2.5">
          <span className="font-mono text-[7px] font-extrabold text-[#00FF41] bg-[#0A0A0C]/90 px-1 py-0.5 border border-[#00FF41]/40 uppercase tracking-wider self-start">
            KODAK 5219 GRADE
          </span>
        </div>
      </div>

      {/* DRAG HANDLE BAR */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-[#F5F5F5] pointer-events-none shadow-[0_0_8px_rgba(255,255,255,0.7)]"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-5 bg-[#141418] border border-[#F5F5F5] flex items-center justify-center shadow-md">
          <SlidersHorizontal size={8} className="text-[#F5F5F5]" />
        </div>
      </div>

      <div className="absolute top-2 right-2 font-mono text-[7px] text-[#8A8A8E] bg-[#0A0A0C]/90 px-1.5 py-0.5 border border-[#2A2A2C] uppercase tracking-widest pointer-events-none">
        DRAG TO SPLIT
      </div>
    </div>
  );
}

// 2. SFX / Audio Category: Corner Animated Frequency Bars + Waveform Texture
function AudioCategoryPreview({ isHovered }: { isHovered: boolean }) {
  const [barHeights, setBarHeights] = useState([30, 60, 45, 80, 55, 90, 40]);

  useEffect(() => {
    if (!isHovered) return;
    const interval = setInterval(() => {
      setBarHeights((prev) =>
        prev.map(() => Math.floor(20 + Math.random() * 75))
      );
    }, 120);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div className="relative h-32 bg-[#060608] border-b border-[#2A2A2C] overflow-hidden flex flex-col justify-between p-3 select-none">
      {/* BACKGROUND WAVE PATTERN */}
      <div className="absolute inset-0 bg-dot-matrix-fine opacity-25 pointer-events-none" />

      {/* STATIC AUDIO OSCILLATION WAVEFORM BARS */}
      <div className="absolute inset-x-3 inset-y-6 flex items-center justify-between gap-[3px] opacity-40">
        {Array.from({ length: 32 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-[#1E1E24]"
            style={{
              height: `${Math.round(20 + Math.sin(i * 0.4) * 35 + Math.cos(i * 0.9) * 20)}%`,
            }}
          />
        ))}
      </div>

      {/* TOP STATUS */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#0A0A0C]/90 border border-[#2A2A2C]">
          <Activity size={10} className="text-[#00FF41]" />
          <span className="font-mono text-[8px] text-[#00FF41] font-bold uppercase tracking-wider">
            {isHovered ? 'AUDITIONING STEM...' : '24-BIT / 48kHz'}
          </span>
        </div>
        <span className="font-mono text-[7px] text-[#8A8A8E]">STEREO PCM</span>
      </div>

      {/* CORNER ANIMATED FREQUENCY BARS */}
      <div className="relative z-10 flex items-end justify-between">
        <div className="flex items-end gap-1 h-8 px-2 py-1 bg-[#0A0A0C]/90 border border-[#2A2A2C]">
          {barHeights.map((h, i) => (
            <div
              key={i}
              className={cn(
                'w-1 transition-all duration-100',
                isHovered ? 'bg-[#00FF41] shadow-[0_0_6px_#00FF41]' : 'bg-[#2A2A30]'
              )}
              style={{ height: `${isHovered ? h : 25}%` }}
            />
          ))}
        </div>

        <span className="font-mono text-[7px] text-[#525256] uppercase">
          {isHovered ? 'PEAK: -0.2 dB' : 'PEAK: IDLE'}
        </span>
      </div>
    </div>
  );
}

// 3. Contract / Legal Spec Category: First 3 Lines Monospace Document Preview
function ContractCategoryPreview() {
  return (
    <div className="relative h-32 bg-[#070709] border-b border-[#2A2A2C] overflow-hidden p-3 font-mono select-none flex flex-col justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-[8px] text-[#00FF41] font-bold pb-1 border-b border-[#1A1A1E]">
          <FileText size={10} />
          <span>PRODUCTION MASTER SPECIFICATION // MIT LICENSE</span>
        </div>
        <div className="text-[7.5px] text-[#8A8A8E] leading-relaxed pt-1 space-y-0.5">
          <p className="text-[#00FF41]/90">01 // EDITX MASTER COMMERCIAL RETAINER & NDA</p>
          <p>02 // SEC. 4.1: WORLDWIDE IRREVOCABLE COMMERCIAL GRANT</p>
          <p className="text-[#525256]">03 // SEC. 4.2: UNRESTRICTED DERIVATIVES & BROADCAST RIGHTS...</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-[7px] text-[#525256] border-t border-[#18181C] pt-1">
        <span>STATUS: LEGAL SIGN-OFF VERIFIED</span>
        <span className="text-[#00FF41]">DOCX / PDF</span>
      </div>
    </div>
  );
}

// 4. Lottie / Kinetic Overlays Category: Miniature Kinetic Radar Loop
function KineticCategoryPreview({ isHovered }: { isHovered: boolean }) {
  return (
    <div className="relative h-32 bg-[#060608] border-b border-[#2A2A2C] overflow-hidden flex items-center justify-center p-3 select-none">
      <div className="absolute inset-0 bg-dot-matrix-fine opacity-25 pointer-events-none" />

      {/* RADAR SWEEP CIRCLES */}
      <div className="relative w-20 h-20 flex items-center justify-center">
        <div
          className={cn(
            'absolute inset-0 rounded-full border border-[#00FF41]/30 transition-all duration-500',
            isHovered && 'scale-110 border-[#00FF41]/60 shadow-[0_0_12px_rgba(255,68,0,0.3)]'
          )}
        />
        <div className="absolute w-12 h-12 rounded-full border border-dashed border-[#8A8A8E]/40 animate-spin" style={{ animationDuration: '8s' }} />
        <div className="w-4 h-4 bg-[#00FF41]/20 border border-[#00FF41] flex items-center justify-center">
          <span className="w-1.5 h-1.5 bg-[#00FF41] animate-pulse" />
        </div>
      </div>

      <div className="absolute bottom-2 left-3 font-mono text-[7px] text-[#8A8A8E] uppercase tracking-wider">
        60 FPS KINETIC VECTOR
      </div>
      <div className="absolute bottom-2 right-3 font-mono text-[7px] text-[#00FF41] uppercase tracking-wider">
        {isHovered ? 'ACTIVE LOOP' : 'READY'}
      </div>
    </div>
  );
}

export function DropCard({ drop }: DropCardProps) {
  const [downloadState, setDownloadState] = useState<'idle' | 'extracting' | 'complete' | 'error'>('idle');
  const [isHovered, setIsHovered] = useState(false);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const categoryName = drop.categories?.name || 'ASSET';
  const categorySlug = drop.categories?.slug || 'asset';
  const isLut = categorySlug === 'luts' || drop.file_format?.toLowerCase() === 'cube';
  const isSfx = categorySlug === 'sfx' || drop.file_format?.toLowerCase() === 'wav';
  const isContract = categorySlug === 'contracts' || drop.file_format?.toLowerCase() === 'docx';

  const handleMouseEnter = () => {
    setIsHovered(true);
    playCardHover();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleToggleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    playSubThump();
    setDownloadState('extracting');

    try {
      const downloadUrl = `/api/download?dropId=${drop.id}`;
      const res = await fetch(downloadUrl);
      if (!res.ok) {
        let msg = `Server returned ${res.status}`;
        try {
          const errData = await res.json();
          if (errData?.error) msg = errData.error;
        } catch {}
        throw new Error(msg);
      }

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (data.url) {
          const a = document.createElement('a');
          a.href = data.url;
          a.download = data.filename || `${drop.title}.${drop.file_format || 'zip'}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setDownloadState('complete');
          return;
        }
        throw new Error(data.error || 'Download URL missing');
      }

      // Direct binary file stream from server (ZIP/WAV/CUBE/PDF)
      const blob = await res.blob();
      const disposition = res.headers.get('content-disposition') || '';
      let filename = `${drop.title}.${drop.file_format || 'zip'}`;
      const filenameMatch = disposition.match(/filename="?([^"]+)"?/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }

      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);

      setDownloadState('complete');
    } catch (err) {
      console.error('Download error:', err);
      setDownloadState('error');
    } finally {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => {
        setDownloadState('idle');
      }, 4000);
    }
  };

  // Signal meters scaled properly
  const signalHeights = ['h-[4px]', 'h-[6px]', 'h-[8px]', 'h-[10px]', 'h-[12px]'];

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'group relative metal-chassis flex flex-col justify-between overflow-hidden transition-all duration-200 h-full border',
        isHovered
          ? 'border-[#FFFFFF] shadow-[0_0_24px_rgba(255,255,255,0.1)]'
          : 'border-[#1F1F24] hover:border-[#3F3F46]'
      )}
    >
      {/* CARD HEADER: EDITORIAL INDEX HEADER */}
      <div className="px-4 py-2.5 bg-[#141417] flex items-center justify-between border-b border-[#1F1F24]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#FFFFFF]" />
          <span className="font-mono text-[9px] font-black text-[#FFFFFF] tracking-[0.2em] uppercase">
            REF-{drop.id.slice(-4).toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[8px] text-[#A1A1AA] uppercase tracking-widest font-semibold">
            EDITION 01
          </span>
        </div>
      </div>

      {/* CATEGORY-SPECIFIC LIVE DEMO */}
      {isLut ? (
        <LutComparisonPreview />
      ) : isSfx ? (
        <AudioCategoryPreview isHovered={isHovered} />
      ) : isContract ? (
        <ContractCategoryPreview />
      ) : (
        <KineticCategoryPreview isHovered={isHovered} />
      )}

      {/* CARD BODY */}
      <div className="p-4 space-y-4 flex-1 flex flex-col justify-between bg-[#0C0C0F]">
        {/* CATEGORY & FORMAT ROW */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-[8px] font-black text-[#FFFFFF] uppercase tracking-[0.16em] px-1.5 py-0.5 border border-[#27272A] bg-[#16161A]">
            {categoryName}
          </span>
          <span className="font-mono text-[9px] font-semibold text-[#A1A1AA] uppercase tracking-[0.12em]">
            {drop.file_format || 'ZIP'}
            {drop.file_size ? ` · ${formatBytes(drop.file_size)}` : ''}
          </span>
        </div>

        {/* TITLE */}
        <div>
          <h3 className="font-display font-black text-base text-[#FFFFFF] uppercase tracking-[-0.02em] leading-snug line-clamp-2">
            {drop.title}
          </h3>
          <p className="font-mono text-[8px] text-[#71717A] uppercase tracking-[0.14em] mt-1.5">
            LICENSE: {drop.license || 'MIT'} · {drop.download_count || 480} EXTRACTED
          </p>
        </div>

        {/* ACTION ROW */}
        <div className="pt-3 border-t border-[#1F1F24] space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            {/* SIGNAL STRENGTH FILL BAR WITH REAL INCREMENTAL HEIGHT */}
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[7px] text-[#71717A] uppercase tracking-wider">
                SIG
              </span>
              <div className="flex items-end gap-0.5 h-3">
                {signalHeights.map((hClass, idx) => (
                  <span
                    key={idx}
                    className={cn(
                      'w-1 transition-all duration-150',
                      hClass,
                      isHovered ? 'bg-[#FFFFFF]' : 'bg-[#27272A]'
                    )}
                  />
                ))}
              </div>
            </div>

            {/* MECHANICAL TOGGLE BUTTON */}
            <button
              onClick={handleToggleClick}
              disabled={downloadState === 'extracting'}
              aria-label={`Toggle hardware switch to extract ${drop.title}`}
              className={cn(
                'px-3.5 py-1.5 font-mono text-[9px] font-black tracking-[0.16em] uppercase flex items-center gap-1.5 border cursor-pointer select-none transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white',
                downloadState === 'idle' &&
                  'bg-[#FFFFFF] hover:bg-[#E4E4E7] text-[#000000] border-[#FFFFFF]',
                downloadState === 'extracting' &&
                  'bg-[#A1A1AA] text-[#000000] border-[#A1A1AA]',
                downloadState === 'complete' &&
                  'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF]',
                downloadState === 'error' &&
                  'bg-[#FF3333] text-[#FFFFFF] border-[#FF3333]'
              )}
            >
              {downloadState === 'extracting' ? (
                <span className="animate-pulse">EXTRACTING...</span>
              ) : downloadState === 'complete' ? (
                <>
                  <span className="w-1.5 h-1.5 bg-[#000000]" />
                  SAVED
                </>
              ) : downloadState === 'error' ? (
                <>
                  <AlertCircle size={11} className="stroke-[2.5]" />
                  FAILED
                </>
              ) : (
                <>
                  <Download size={11} className="stroke-[2.5]" />
                  GET DROP
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
