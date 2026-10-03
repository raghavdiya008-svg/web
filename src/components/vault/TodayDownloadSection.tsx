'use client';
import { useState, useRef, useEffect } from 'react';
import { Download, Check, Play, Pause, Share2, Copy } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { playMechanicalClick, playToggleThud } from '@/lib/audio/soundFx';

interface TodayDownloadSectionProps {
  drop: {
    id: string;
    title: string;
    file_format?: string;
    file_size?: number;
    categories?: {
      slug?: string;
      name?: string;
      color?: string;
    };
  };
}

export function TodayDownloadSection({ drop }: TodayDownloadSectionProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(30);
  const [copied, setCopied] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1.8));
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const toggleAudio = () => {
    playMechanicalClick();
    try {
      if (!isPlaying) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(65, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(28, ctx.currentTime + 1.4);

          gain.gain.setValueAtTime(0.25, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.8);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();

          audioCtxRef.current = ctx;
        }
        setIsPlaying(true);
      } else {
        if (audioCtxRef.current) {
          audioCtxRef.current.close().catch(() => {});
        }
        setIsPlaying(false);
      }
    } catch {
      setIsPlaying(!isPlaying);
    }
  };

  const handleDownload = async () => {
    playToggleThud();
    setDownloading(true);
    try {
      const res = await fetch(`/api/download?dropId=${drop.id}`);
      if (!res.ok) {
        throw new Error(`Download failed with status ${res.status}`);
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
          setDownloaded(true);
          setTimeout(() => setDownloaded(false), 4000);
          return;
        }
      }

      // Direct binary stream from server (ZIP/WAV/CUBE/PDF)
      const blob = await res.blob();
      const disposition = res.headers.get('content-disposition') || '';
      let filename = `${drop.title}.${drop.file_format || 'zip'}`;
      const match = disposition.match(/filename="?([^"]+)"?/);
      if (match && match[1]) filename = match[1];

      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 4000);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyLink = () => {
    playMechanicalClick();
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareX = () => {
    playMechanicalClick();
    const text = `Just grabbed "${drop.title}" from @EditXVault — precision daily assets for editors & 3D artists.`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`,
      '_blank'
    );
  };

  return (
    <div className="space-y-6">
      {/* INTERACTIVE PREVIEW — ANALOG DESK CONSOLE */}
      <div className="metal-chassis p-6 space-y-4">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#2A2A2C]">
          <div className="flex items-center gap-2">
            <span className="rivet" />
            <span className="font-mono text-[9px] font-bold text-[#F5F5F5] uppercase tracking-[0.16em]">
              HARDWARE BUS #01 // 24-BIT STEM AUDITION
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[8px] text-[#00FF41] bg-[#00FF41]/10 border border-[#00FF41]/40 px-2 py-0.5 uppercase tracking-wider font-bold">
              CALIBRATED 48kHz STEREO
            </span>
            <span className="rivet" />
          </div>
        </div>

        {/* WAVEFORM PREVIEW */}
        <div className="flex items-center gap-4 bg-[#060608] p-3 border border-[#222226] shadow-hardware-inset">
          <button
            onClick={toggleAudio}
            className="w-12 h-12 flex items-center justify-center bg-[#00FF41] text-[#0A0A0C] hover:bg-[#00FF41]/90 transition-all shrink-0 active:scale-95 shadow-[0_0_12px_rgba(0,255,65,0.3)] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00FF41]"
            aria-label={isPlaying ? 'Pause audio preview' : 'Play audio preview stem'}
          >
            {isPlaying ? (
              <Pause size={18} className="fill-current" />
            ) : (
              <Play size={18} className="fill-current translate-x-0.5" />
            )}
          </button>

          <div
            role="slider"
            aria-label="Audio playback position"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            tabIndex={0}
            className="flex-1 flex items-center gap-1 h-12 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00FF41] px-1"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              setProgress(Math.round((clickX / rect.width) * 100));
              playMechanicalClick();
            }}
          >
            {Array.from({ length: 48 }).map((_, i) => {
              const barPercent = (i / 48) * 100;
              const isPlayed = barPercent <= progress;
              const height = Math.round(15 + Math.sin(i * 0.4) * 40 + Math.cos(i * 0.2) * 35);
              return (
                <div
                  key={i}
                  className="w-full transition-all duration-150"
                  style={{
                    height: `${Math.min(100, Math.max(12, height))}%`,
                    backgroundColor: isPlayed ? '#00FF41' : '#222228',
                    boxShadow: isPlayed && isPlaying ? '0 0 6px rgba(0, 255, 65, 0.45)' : 'none',
                  }}
                />
              );
            })}
          </div>

          <div className="font-mono text-xs text-[#8A8A8E] shrink-0 tabular-nums">
            {isPlaying
              ? `0:${String(Math.round((progress / 100) * 42)).padStart(2, '0')}`
              : '0:14'}{' '}
            / 0:42
          </div>
        </div>
      </div>

      {/* DOWNLOAD & SHARE BUTTONS */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={handleDownload}
          disabled={downloading}
          aria-label="Download asset now for free"
          className="w-full sm:w-auto px-8 py-3.5 bg-[#00FF41] text-[#0A0A0C] font-mono text-xs font-bold uppercase tracking-[0.12em] border border-[#00FF41] shadow-[0_0_15px_rgba(0,255,65,0.3)] hover:bg-[#00FF41]/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {downloaded ? (
            <>
              <Check size={16} /> ASSET DOWNLOADED ✓
            </>
          ) : (
            <>
              <Download size={16} /> INITIALIZE EXTRACTION (FREE)
            </>
          )}
        </button>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleShareX}
            aria-label="Share drop on X"
            className="flex-1 sm:flex-none px-4 py-3.5 bg-[#141418] hover:bg-[#1C1C22] text-[#F5F5F5] font-mono text-xs font-semibold uppercase tracking-wider border border-[#2A2A2C] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Share2 size={13} />
            POST TO X
          </button>

          <button
            onClick={handleCopyLink}
            aria-label="Copy direct asset link to clipboard"
            className="flex-1 sm:flex-none px-4 py-3.5 bg-[#141418] hover:bg-[#1C1C22] text-[#F5F5F5] font-mono text-xs font-semibold uppercase tracking-wider border border-[#2A2A2C] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Copy size={13} />
            {copied ? 'COPIED! ✓' : 'COPY LINK'}
          </button>
        </div>
      </div>
    </div>
  );
}
