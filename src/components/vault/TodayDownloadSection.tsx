'use client';
import { useState, useRef, useEffect } from 'react';
import { Download, Check, Share2, Copy } from 'lucide-react';
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
  const [copied, setCopied] = useState(false);

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
      {/* INTERACTIVE PREVIEW */}
      <div className="metal-chassis p-6 space-y-4">
        <div className="flex items-center justify-between pb-3.5 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-[12px] font-bold text-primary uppercase tracking-wider">
              {drop.categories?.slug === 'luts' ? 'COLOR SCIENCE CALIBRATION' : drop.categories?.slug === 'typography' ? 'TYPOGRAPHIC SPECIMEN' : 'ASSET PREVIEW & SPECIFICATION'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[12px] text-accent bg-accent/10 border border-accent/40 px-2 py-0.5 uppercase tracking-wider font-bold">
              {drop.categories?.slug === 'luts' ? '33×33×33 3D CUBE' : drop.categories?.slug === 'typography' ? 'VARIABLE WEIGHT OTF/TTF' : '4K PRORES / ALPHA'}
            </span>
          </div>
        </div>

        {/* DYNAMIC TELEMETRY DISPLAY */}
        {drop.categories?.slug === 'luts' ? (
          <div className="bg-surface-elevated p-4 border border-border space-y-3 font-mono">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[12px]">
              <div className="p-2 border border-border bg-surface">
                <span className="text-muted block text-[11px] uppercase tracking-wider">LUT SIZE</span>
                <span className="text-accent font-bold">33×33×33 .CUBE</span>
              </div>
              <div className="p-2 border border-border bg-surface">
                <span className="text-muted block text-[11px] uppercase tracking-wider">GAMMA CURVE</span>
                <span className="text-primary font-bold">KODAK 5219 S-CURVE</span>
              </div>
              <div className="p-2 border border-border bg-surface">
                <span className="text-muted block text-[11px] uppercase tracking-wider">TARGET SPACE</span>
                <span className="text-primary font-bold">REC.709 / LOG</span>
              </div>
              <div className="p-2 border border-border bg-surface">
                <span className="text-muted block text-[11px] uppercase tracking-wider">HOST NLE</span>
                <span className="text-accent font-bold">DAVINCI & LUMETRI</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-muted pt-2 border-t border-border">
              <span>CALIBRATION: VERIFIED STUDIO SPECTRAL RESPONSE</span>
              <span className="text-accent font-bold">● REC.709 CALIBRATED</span>
            </div>
          </div>
        ) : drop.categories?.slug === 'typography' ? (
          <div className="bg-surface-elevated p-4 border border-border space-y-2">
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-primary font-sans">
              THE QUICK BROWN FOX JUMPS OVER 123
            </div>
            <div className="flex items-center justify-between font-mono text-[11px] text-muted pt-2 border-t border-border">
              <span>FORMAT: OPENTYPE / TRUETYPE VARIABLE</span>
              <span className="text-accent font-bold">● SIL OFL-1.1 LICENSE</span>
            </div>
          </div>
        ) : (
          <div className="bg-surface-elevated p-4 border border-border font-mono text-[12px] space-y-2">
            <div className="flex items-center justify-between text-primary font-bold">
              <span>SPEC: {drop.title}</span>
              <span className="text-accent">100% ROYALTY FREE</span>
            </div>
            <div className="text-[11px] text-muted">
              COMPATIBLE NLE: ADOBE PREMIERE PRO · DAVINCI RESOLVE · FINAL CUT PRO · AFTER EFFECTS
            </div>
          </div>
        )}
      </div>

      {/* DOWNLOAD & SHARE BUTTONS */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={handleDownload}
          disabled={downloading}
          aria-label="Download asset now for free"
          className="w-full sm:w-auto px-8 py-3.5 bg-[#FFFFFF] dark:bg-[#FFFFFF] light:bg-[#111113] text-[#000000] dark:text-[#000000] light:text-[#FFFFFF] font-mono text-xs font-black uppercase tracking-[0.16em] border border-transparent rounded-[2px] shadow-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {downloaded ? (
            <>
              <Check size={15} /> ASSET DOWNLOADED ✓
            </>
          ) : downloading ? (
            <span className="animate-pulse">DOWNLOADING...</span>
          ) : (
            <>
              <Download size={15} /> DOWNLOAD ASSET (FREE)
            </>
          )}
        </button>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleShareX}
            aria-label="Share drop on X"
            className="flex-1 sm:flex-none px-5 py-3.5 bg-[#141418] light:bg-[#FFFFFF] hover:bg-[#1C1C22] light:hover:bg-[#F4F4F6] text-[#F5F5F5] light:text-[#111113] font-mono text-xs font-semibold uppercase tracking-wider border border-[#2A2A2C] light:border-[#E2E2E6] rounded-[2px] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Share2 size={13} />
            POST TO X
          </button>

          <button
            onClick={handleCopyLink}
            aria-label="Copy direct asset link to clipboard"
            className="flex-1 sm:flex-none px-5 py-3.5 bg-[#141418] light:bg-[#FFFFFF] hover:bg-[#1C1C22] light:hover:bg-[#F4F4F6] text-[#F5F5F5] light:text-[#111113] font-mono text-xs font-semibold uppercase tracking-wider border border-[#2A2A2C] light:border-[#E2E2E6] rounded-[2px] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Copy size={13} />
            {copied ? 'COPIED! ✓' : 'COPY LINK'}
          </button>
        </div>
      </div>
    </div>
  );
}
