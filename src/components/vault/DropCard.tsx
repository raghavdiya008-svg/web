'use client';
import { useState, useRef, useEffect } from 'react';
import { Download, SlidersHorizontal, FileText, Activity, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { formatBytes } from '@/lib/utils/format';
import { playCardHover, playSubThump } from '@/lib/audio/soundFx';

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

  const handlePointerUp = () => setIsDragging(false);
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
      className="relative h-32 bg-[#060608] border-b border-border overflow-hidden cursor-ew-resize select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
    >
      <div className="absolute inset-0 bg-surface flex items-end p-2.5">
        <div className="w-full h-full bg-gradient-to-r from-[#1C1C20] via-[#222226] to-[#18181C] flex flex-col justify-end">
          <span className="font-mono text-[12px] font-bold text-muted bg-[#0A0A0C]/90 px-1 py-0.5 border border-border uppercase tracking-wider self-start">
            RAW LOG
          </span>
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPos}%` }}>
        <div className="w-[320px] sm:w-[380px] h-full bg-gradient-to-r from-[#2A1605] via-[#4A2608] to-[#113123] flex flex-col justify-end p-2.5">
          <span className="font-mono text-[12px] font-extrabold text-accent bg-[#0A0A0C]/90 px-1 py-0.5 border border-accent/40 uppercase tracking-wider self-start">
            GRADED
          </span>
        </div>
      </div>

      <div
        className="absolute top-0 bottom-0 w-[2px] bg-primary pointer-events-none shadow-[0_0_8px_rgba(255,255,255,0.7)]"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-6 bg-surface border border-primary flex items-center justify-center shadow-md">
          <SlidersHorizontal size={12} className="text-primary" />
        </div>
      </div>

      <div className="absolute top-2 right-2 font-mono text-[12px] text-muted bg-[#0A0A0C]/90 px-1.5 py-0.5 border border-border uppercase tracking-widest pointer-events-none">
        SPLIT
      </div>
    </div>
  );
}

function AudioCategoryPreview({ isHovered }: { isHovered: boolean }) {
  const [barHeights, setBarHeights] = useState([30, 60, 45, 80, 55, 90, 40]);

  useEffect(() => {
    if (!isHovered) return;
    const interval = setInterval(() => {
      setBarHeights((prev) => prev.map(() => Math.floor(20 + Math.random() * 75)));
    }, 120);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div className="relative h-32 bg-[#060608] border-b border-border overflow-hidden flex flex-col justify-between p-3 select-none">
      <div className="absolute inset-0 bg-dot-matrix-fine opacity-25 pointer-events-none" />
      <div className="absolute inset-x-3 inset-y-6 flex items-center justify-between gap-[3px] opacity-40">
        {Array.from({ length: 32 }).map((_, i) => (
          <div key={i} className="flex-1 bg-[#1E1E24]" style={{ height: `${Math.round(20 + Math.sin(i * 0.4) * 35 + Math.cos(i * 0.9) * 20)}%` }} />
        ))}
      </div>
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-surface/90 border border-border">
          <Activity size={12} className="text-accent" />
          <span className="font-mono text-[12px] text-accent font-bold uppercase tracking-wider">
            {isHovered ? 'AUDITIONING' : 'READY'}
          </span>
        </div>
      </div>
      <div className="relative z-10 flex items-end justify-between">
        <div className="flex items-end gap-1 h-8 px-2 py-1 bg-surface/90 border border-border">
          {barHeights.map((h, i) => (
            <div key={i} className={cn('w-1 transition-all duration-100', isHovered ? 'bg-accent shadow-[0_0_6px_var(--color-accent)]' : 'bg-[#2A2A30]')} style={{ height: `${isHovered ? h : 25}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ContractCategoryPreview() {
  return (
    <div className="relative h-32 bg-[#070709] border-b border-border overflow-hidden p-3 font-mono select-none flex flex-col justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-[12px] text-accent font-bold pb-1 border-b border-[#1A1A1E]">
          <FileText size={12} />
          <span>DOCUMENTATION</span>
        </div>
        <div className="text-[12px] text-muted leading-relaxed pt-1 space-y-1">
          <p className="text-accent/90">SEC. 4.1: COMMERCIAL GRANT</p>
          <p>SEC. 4.2: UNRESTRICTED RIGHTS...</p>
        </div>
      </div>
    </div>
  );
}

function KineticCategoryPreview({ isHovered }: { isHovered: boolean }) {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => { setIsLoaded(true); }, []);

  if (!isLoaded) {
    return <div className="h-32 bg-surface animate-pulse border-b border-border" />;
  }

  return (
    <div className="relative h-32 bg-[#060608] border-b border-border overflow-hidden flex items-center justify-center p-3 select-none">
      <div className="absolute inset-0 bg-dot-matrix-fine opacity-25 pointer-events-none" />
      <div className="relative w-20 h-20 flex items-center justify-center">
        <div className={cn('absolute inset-0 rounded-full border border-accent/30 transition-all duration-500', isHovered && 'scale-110 border-accent/60 shadow-[0_0_12px_var(--color-accent)]')} />
        <div className="absolute w-12 h-12 rounded-full border border-dashed border-muted/40 animate-spin [animation-duration:8s]" />
        <div className="w-4 h-4 bg-accent/20 border border-accent flex items-center justify-center">
          <span className="w-1.5 h-1.5 bg-accent animate-pulse" />
        </div>
      </div>
      <div className="absolute bottom-2 right-3 font-mono text-[12px] text-accent uppercase tracking-wider">
        {isHovered ? 'ACTIVE' : 'READY'}
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

  const handleMouseEnter = () => { setIsHovered(true); playCardHover(); };
  const handleMouseLeave = () => { setIsHovered(false); };

  const handleToggleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    playSubThump();
    setDownloadState('extracting');

    try {
      const downloadUrl = `/api/download?dropId=${drop.id}`;
      const res = await fetch(downloadUrl);
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const filename = `${drop.title}.${drop.file_format || 'zip'}`;
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
      setDownloadState('error');
    } finally {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => setDownloadState('idle'), 4000);
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'group relative metal-chassis flex flex-col justify-between overflow-hidden transition-all duration-200 h-full border rounded-[2px]',
        isHovered ? 'border-muted shadow-lg' : 'border-border hover:border-border-hover'
      )}
    >
      <div className="px-4 py-3 bg-surface flex items-center justify-between border-b border-border">
        <span className="font-mono text-[12px] text-primary tracking-widest uppercase">
          REF-{drop.id.slice(-4).toUpperCase()}
        </span>
        <span className="font-mono text-[12px] font-bold text-muted uppercase tracking-widest px-2 py-0.5 border border-border bg-surface-elevated">
          {categoryName}
        </span>
      </div>

      {isLut ? (
        <LutComparisonPreview />
      ) : isSfx ? (
        <AudioCategoryPreview isHovered={isHovered} />
      ) : isContract ? (
        <ContractCategoryPreview />
      ) : (
        <KineticCategoryPreview isHovered={isHovered} />
      )}

      <div className="p-4 space-y-4 flex-1 flex flex-col justify-between bg-surface">
        <div className="space-y-1">
          <h3 
            title={drop.title} 
            className="font-display font-bold text-base text-primary tracking-tight leading-snug line-clamp-2 text-balance"
          >
            {drop.title}
          </h3>
          <p className="text-[14px] text-secondary">
            {drop.file_format || 'ZIP'} {drop.file_size ? `· ${formatBytes(drop.file_size)}` : ''} · {drop.license || 'MIT'}
          </p>
        </div>

        <div className="pt-3 border-t border-border">
          <button
            onClick={handleToggleClick}
            disabled={downloadState === 'extracting'}
            aria-label={`Download ${drop.title}`}
            className={cn(
              'w-full py-2.5 font-mono text-[12px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 border rounded-[2px] cursor-pointer select-none transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
              downloadState === 'idle' && 'bg-primary text-black border-transparent hover:opacity-90 active:scale-95 shadow-sm',
              downloadState === 'extracting' && 'bg-muted text-black border-transparent',
              downloadState === 'complete' && 'bg-accent text-black border-transparent',
              downloadState === 'error' && 'bg-red-500 text-white border-transparent'
            )}
          >
            {downloadState === 'extracting' ? (
              <span className="animate-pulse">EXTRACTING...</span>
            ) : downloadState === 'complete' ? (
              <>SAVED</>
            ) : downloadState === 'error' ? (
              <>FAILED</>
            ) : (
              <>
                <Download size={14} className="stroke-[2]" /> GET DROP
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
