'use client';
import { useState, useEffect, useRef } from 'react';
import { Download, Disc, Cpu, FileCheck, Layers } from 'lucide-react';
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
    categories?: { name?: string };
  };
  session?: any;
}

export function FeaturedDrop({ drop, session }: FeaturedDropProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [downloadError, setDownloadError] = useState(false);
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
        downloadTimerRef.current = setTimeout(() => setDownloaded(false), 4500);
      } else throw new Error('Missing URL');
    } catch (err) {
      setDownloadError(true);
      errorTimerRef.current = setTimeout(() => setDownloadError(false), 4000);
    } finally {
      setDownloading(false);
    }
  };

  const categoryName = drop.categories?.name || 'ANALOG SFX';

  return (
    <div className="relative metal-chassis overflow-hidden">
      
      <div className="sticky top-14 z-30 bg-surface border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <div className="flex items-center gap-2">
            <span className="font-mono text-[12px] font-black text-primary uppercase">
              TRANSMISSION // LIVE DROP
            </span>
          </div>
          <span className="hidden md:inline text-border">/</span>
          <span className="hidden md:inline font-mono text-[12px] text-muted uppercase">
            30 FPS SMPTE LOCK
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="font-mono text-[12px] text-primary bg-background px-3 py-1 border border-border tabular-nums font-bold">
            {timecode}
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-8 bg-surface">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-border">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-[12px] font-bold text-primary uppercase px-2 py-0.5 border border-primary bg-primary/10">
                {categoryName}
              </span>
              <span className="text-border">/</span>
              <span className="font-mono text-[12px] text-muted uppercase">
                INDEX REF: ARCHIVE-DROP-{drop.id.slice(-4).toUpperCase()}
              </span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-primary tracking-tight leading-tight text-balance">
              {drop.title}
            </h2>
          </div>

          <div className="px-4 py-2 border border-border bg-surface-elevated flex items-center gap-3 self-start md:self-center">
            <div className="flex flex-col">
              <span className="font-mono text-[12px] font-black text-primary uppercase">
                DIRECTOR CUT
              </span>
              <span className="font-mono text-[12px] text-muted uppercase">
                VERIFIED MASTER ARCHIVE
              </span>
            </div>
          </div>
        </div>

        <WaveformPlayer title={drop.title} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          <div className="lg:col-span-8 p-6 bg-background border border-border space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <span className="font-mono text-[12px] font-black text-primary uppercase">
                SPECIFICATION DATA SHEET
              </span>
              <span className="font-mono text-[12px] text-muted uppercase font-bold">
                AUDITED SPEC
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-mono text-[12px] text-muted uppercase">
                  <Disc size={14} className="text-primary" /> FORMAT
                </div>
                <div className="font-mono text-[13px] font-bold text-primary uppercase">
                  {drop.file_format || 'WAV'} / PCM
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-mono text-[12px] text-muted uppercase">
                  <Cpu size={14} className="text-primary" /> SIZE
                </div>
                <div className="font-mono text-[13px] font-bold text-primary uppercase">
                  {drop.file_size ? formatBytes(drop.file_size) : '142.0 MB'}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-mono text-[12px] text-muted uppercase">
                  <FileCheck size={14} className="text-primary" /> LICENSE
                </div>
                <div className="font-mono text-[13px] font-bold text-primary uppercase">
                  {drop.license || 'MIT / CC-0'}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-mono text-[12px] text-muted uppercase">
                  <Layers size={14} className="text-muted" /> HOST NLE
                </div>
                <div className="font-mono text-[13px] font-bold text-primary uppercase">
                  UNIVERSAL
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border">
              <p className="text-[14px] text-muted font-body leading-relaxed text-pretty">
                {drop.description ||
                  'Precision-engineered creative stems for trailer scoring and VFX sound design. Hand-tuned analog oscillators and organic brass resonances for high-tension cinematic storytelling.'}
              </p>
            </div>
          </div>

          <div className="lg:col-span-4 p-6 bg-background border border-border flex flex-col justify-between space-y-5">
            <div>
              <div className="font-mono text-[12px] font-black text-primary uppercase mb-1">
                EXTRACTION BAY
              </div>
              <div className="font-mono text-[12px] text-muted uppercase flex items-center gap-1.5 font-semibold">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                DIRECT ACCESS ACTIVE
              </div>
            </div>

            <button
              onClick={handleDownload}
              disabled={downloading}
              className={cn(
                'w-full py-4 px-4 font-mono text-[13px] font-black uppercase flex items-center justify-center gap-2 border cursor-pointer select-none transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
                downloaded
                  ? 'bg-accent text-black border-transparent'
                  : downloadError
                  ? 'bg-red-500 text-white border-transparent'
                  : downloading
                  ? 'bg-muted text-black border-transparent'
                  : 'bg-primary hover:bg-surface-elevated text-black border-transparent'
              )}
            >
              {downloading ? (
                <span className="animate-pulse">EXTRACTING...</span>
              ) : downloaded ? (
                <>SAVED</>
              ) : downloadError ? (
                <>DOWNLOAD FAILED</>
              ) : (
                <>
                  <Download size={16} className="stroke-[2.5]" />
                  DOWNLOAD MASTER ASSET
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
