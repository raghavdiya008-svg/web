'use client';
import { useState, useEffect, useRef } from 'react';
import {
  Download,
  Disc,
  Cpu,
  FileCheck,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { formatBytes } from '@/lib/utils/format';
import { playSubThump } from '@/lib/audio/soundFx';
import { WaveformPlayer } from '@/components/vault/AssetPreview/WaveformPlayer';
import { useSmpteTimecode } from '@/hooks/useSmpteTimecode';

interface FeaturedDropProps {
  drop: {
    id: string;
    title: string;
    description?: string;
    file_format?: string;
    file_size?: number;
    license?: string;
    download_count?: number;
    instructions?: string;
    compatible_software?: string[];
    categories?: {
      slug?: string;
      name?: string;
      color?: string;
    };
  };
  session?: unknown;
}

export function FeaturedDrop({ drop }: FeaturedDropProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [downloadError, setDownloadError] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(48);
  const downloadTimerRef = useRef<NodeJS.Timeout | null>(null);
  const errorTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (downloadTimerRef.current) clearTimeout(downloadTimerRef.current);
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    };
  }, []);

  const timecode = useSmpteTimecode(0, 0, 14, 21);

  const handleDownload = async () => {
    playSubThump();
    setDownloading(true);
    setDownloadError(false);
    try {
      const res = await fetch(`/api/download?dropId=${drop.id}`);
      if (!res.ok) throw new Error('Download failed');
      const data = await res.json();
      if (data.url) {
        const a = document.createElement('a');
        a.href = data.url;
        a.download = data.filename || `${drop.title}.${drop.file_format || 'zip'}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setDownloaded(true);
        if (downloadTimerRef.current) clearTimeout(downloadTimerRef.current);
        downloadTimerRef.current = setTimeout(() => setDownloaded(false), 4500);
      } else {
        throw new Error('Missing download URL');
      }
    } catch (err) {
      console.error('Download error:', err);
      setDownloadError(true);
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      errorTimerRef.current = setTimeout(() => setDownloadError(false), 4000);
    } finally {
      setDownloading(false);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    setPlaybackProgress(Math.round((x / rect.width) * 100));
  };

  const handleKeyDownSeek = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      setPlaybackProgress((prev) => Math.min(100, prev + 5));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      setPlaybackProgress((prev) => Math.max(0, prev - 5));
    }
  };

  const categoryName = drop.categories?.name || 'ANALOG SFX';

  return (
    <div className="relative metal-chassis overflow-hidden">
      
      {/* ============================================================
          STICKY MASTER TRANSPORT BAR WITH SMPTE CLOCK & CALIBRATION
          ============================================================ */}
      <div className="sticky top-14 z-30 bg-[#0E0E12] border-b border-[#1F1F24] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 bg-[#FFFFFF]" />
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] font-black text-[#FFFFFF] tracking-[0.2em] uppercase">
              TRANSMISSION // LIVE DROP
            </span>
          </div>
          <span className="hidden md:inline text-[#27272A]">/</span>
          <span className="hidden md:inline font-mono text-[8px] text-[#A1A1AA] uppercase tracking-[0.16em]">
            30 FPS SMPTE LOCK
          </span>
        </div>

        {/* REAL TICKING HARDWARE TIMECODE READOUT */}
        <div className="flex items-center gap-3">
          <div className="font-mono text-xs sm:text-sm text-[#FFFFFF] bg-[#070708] px-3.5 py-1 border border-[#27272A] tabular-nums font-bold tracking-[0.16em]">
            {timecode}
          </div>
        </div>
      </div>

      {/* SMPTE CALIBRATED PROGRESS BAR (CLICKABLE TO SEEK & KEYBOARD ACCESSIBLE) */}
      <div
        role="progressbar"
        tabIndex={0}
        aria-valuenow={playbackProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Transport scrubber position"
        onClick={handleSeek}
        onKeyDown={handleKeyDownSeek}
        className="relative w-full h-1.5 bg-[#16161A] overflow-hidden cursor-pointer group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
      >
        <div
          className="h-full bg-[#FFFFFF] group-hover:bg-[#00FF41] transition-all duration-150 ease-out"
          style={{ width: `${playbackProgress}%` }}
        />
      </div>

      {/* ============================================================
          CHASSIS WORKSPACE
          ============================================================ */}
      <div className="p-6 md:p-8 space-y-8 bg-[#0E0E11]">
        
        {/* ROW 1: HEADER & STAMPED DIRECTOR CUT BADGE */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#1F1F24]">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-[9px] font-black tracking-[0.2em] text-[#FFFFFF] uppercase px-2 py-0.5 border border-[#FFFFFF] bg-[#FFFFFF]/10">
                {categoryName}
              </span>
              <span className="text-[#27272A]">/</span>
              <span className="font-mono text-[9px] text-[#A1A1AA] uppercase tracking-[0.16em]">
                INDEX REF: ARCHIVE-DROP-{drop.id.slice(-4).toUpperCase()}
              </span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-[#FFFFFF] uppercase tracking-[-0.03em]">
              {drop.title}
            </h2>
          </div>

          {/* EDITORIAL STAMP BADGE */}
          <div className="px-4 py-2 border border-[#27272A] bg-[#141417] flex items-center gap-3 self-start md:self-center">
            <div className="flex flex-col">
              <span className="font-mono text-[9px] font-black tracking-[0.22em] text-[#FFFFFF] uppercase">
                DIRECTOR CUT
              </span>
              <span className="font-mono text-[7px] text-[#A1A1AA] uppercase tracking-widest">
                VERIFIED MASTER ARCHIVE
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================
            ROW 2: CUSTOM DAW-STYLE SCRUBBER PLAYER
            ============================================================ */}
        <WaveformPlayer title={drop.title} />

        {/* ============================================================
            ROW 3: TECHNICAL SPEC DATA SHEET & EXTRACTION
            ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* TECHNICAL DATA SHEET (8 COLS) */}
          <div className="lg:col-span-8 p-6 bg-[#0E0E11] border border-[#1F1F24] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F1F24]">
              <span className="font-mono text-[9px] font-black text-[#FFFFFF] tracking-[0.22em] uppercase">
                SPECIFICATION DATA SHEET
              </span>
              <span className="font-mono text-[8px] text-[#A1A1AA] uppercase tracking-[0.16em] font-bold">
                AUDITED SPEC
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* ITEM 1: FORMAT */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-mono text-[8px] text-[#A1A1AA] uppercase tracking-[0.16em]">
                  <Disc size={11} className="text-[#FFFFFF]" />
                  FORMAT
                </div>
                <div className="font-mono text-xs font-bold text-[#FFFFFF] uppercase">
                  {drop.file_format || 'WAV'} / PCM
                </div>
                <div className="font-mono text-[7px] text-[#71717A] tracking-wider">24-BIT / 48kHz</div>
              </div>

              {/* ITEM 2: SIZE */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-mono text-[8px] text-[#A1A1AA] uppercase tracking-[0.16em]">
                  <Cpu size={11} className="text-[#FFFFFF]" />
                  SIZE
                </div>
                <div className="font-mono text-xs font-bold text-[#FFFFFF] uppercase">
                  {drop.file_size ? formatBytes(drop.file_size) : '142.0 MB'}
                </div>
                <div className="font-mono text-[7px] text-[#71717A] tracking-wider">UNCOMPRESSED</div>
              </div>

              {/* ITEM 3: LICENSE */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-mono text-[8px] text-[#A1A1AA] uppercase tracking-[0.16em]">
                  <FileCheck size={11} className="text-[#FFFFFF]" />
                  LICENSE
                </div>
                <div className="font-mono text-xs font-bold text-[#FFFFFF] uppercase">
                  {drop.license || 'MIT / CC-0'}
                </div>
                <div className="font-mono text-[7px] text-[#71717A] tracking-wider">COMMERCIAL FREE</div>
              </div>

              {/* ITEM 4: COMPATIBILITY */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-mono text-[8px] text-[#A1A1AA] uppercase tracking-[0.16em]">
                  <Layers size={11} className="text-[#A1A1AA]" />
                  HOST NLE
                </div>
                <div className="font-mono text-xs font-bold text-[#FFFFFF] uppercase truncate">
                  UNIVERSAL
                </div>
                <div className="font-mono text-[7px] text-[#71717A] tracking-wider">PR / AE / DR / REAPER</div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="pt-3 border-t border-[#1F1F24]">
              <p className="text-xs text-[#A1A1AA] font-body leading-relaxed">
                {drop.description ||
                  'Precision-engineered creative stems for trailer scoring and VFX sound design. Hand-tuned analog oscillators and organic brass resonances for high-tension cinematic storytelling.'}
              </p>
            </div>
          </div>

          {/* EXTRACTION BAY WITH PHYSICAL TOGGLE STATES */}
          <div className="lg:col-span-4 p-6 bg-[#0E0E11] border border-[#1F1F24] flex flex-col justify-between space-y-5">
            <div>
              <div className="font-mono text-[9px] font-black text-[#FFFFFF] uppercase tracking-[0.2em] mb-1">
                EXTRACTION BAY
              </div>
              <div className="font-mono text-[9px] text-[#A1A1AA] uppercase tracking-[0.16em] flex items-center gap-1.5 font-semibold">
                <span className="w-1.5 h-1.5 bg-[#FFFFFF] rounded-none animate-pulse" />
                DIRECT ACCESS ACTIVE
              </div>
            </div>

            {/* BUTTON WITH HIGH-CONTRAST INVERSION & ERROR HANDLING */}
            <button
              onClick={handleDownload}
              disabled={downloading}
              className={cn(
                'w-full py-4 px-4 font-mono text-xs font-black uppercase tracking-[0.18em] flex items-center justify-center gap-2 border cursor-pointer select-none transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white',
                downloaded
                  ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF]'
                  : downloadError
                  ? 'bg-[#FF3333] text-[#FFFFFF] border-[#FF3333]'
                  : downloading
                  ? 'bg-[#E4E4E7] text-[#000000] border-[#E4E4E7]'
                  : 'bg-[#FFFFFF] hover:bg-[#E4E4E7] text-[#000000] border-[#FFFFFF]'
              )}
            >
              {downloading ? (
                <span className="font-mono tracking-widest text-[#000000] animate-pulse">
                  EXTRACTING...
                </span>
              ) : downloaded ? (
                <>
                  <span className="w-1.5 h-1.5 bg-[#000000]" />
                  COMPLETE [SAVED]
                </>
              ) : downloadError ? (
                <>
                  <span className="w-1.5 h-1.5 bg-[#FFFFFF]" />
                  DOWNLOAD FAILED
                </>
              ) : (
                <>
                  <Download size={14} className="stroke-[2.5]" />
                  DOWNLOAD MASTER ASSET
                </>
              )}
            </button>

            <div className="font-mono text-[8px] text-[#71717A] uppercase tracking-[0.14em] text-center">
              CHECKSUM: MD5-VERIFIED · DIRECT CDN LINK
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
