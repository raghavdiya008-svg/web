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
        <div className="flex items-center justify-between pb-3.5 border-b border-[#2A2A2C] light:border-[#E2E2E6]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#00FF41]" />
            <span className="font-mono text-[9px] font-bold text-[#F5F5F5] light:text-[#111113] uppercase tracking-[0.16em]">
              SPECIFICATION // {drop.categories?.slug === 'luts' ? 'COLOR SCIENCE CALIBRATION' : drop.categories?.slug === 'typography' ? 'TYPOGRAPHIC SPECIMEN ENGINE' : 'ASSET SPECIFICATION MONITOR'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[8px] text-[#00FF41] bg-[#00FF41]/10 border border-[#00FF41]/40 px-2 py-0.5 uppercase tracking-wider font-bold">
              {drop.categories?.slug === 'luts' ? '33x33x33 3D CUBE MATRIX' : drop.categories?.slug === 'typography' ? 'VARIABLE WEIGHT OTF/TTF' : '4K UHD PRORES / ALPHA'}
            </span>
          </div>
        </div>

        {/* DYNAMIC TELEMETRY DISPLAY */}
        {drop.categories?.slug === 'luts' ? (
          <div className="bg-[#060608] p-4 border border-[#222226] shadow-hardware-inset space-y-3 font-mono">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[10px]">
              <div className="p-2 border border-[#1A1A1E] bg-[#0B0B0E]">
                <span className="text-[#71717A] block text-[8px] uppercase tracking-wider">LUT SIZE</span>
                <span className="text-[#00FF41] font-bold">33×33×33 (35.9K PTS)</span>
              </div>
              <div className="p-2 border border-[#1A1A1E] bg-[#0B0B0E]">
                <span className="text-[#71717A] block text-[8px] uppercase tracking-wider">GAMMA CURVE</span>
                <span className="text-[#FFFFFF] font-bold">KODAK 5219 S-CURVE</span>
              </div>
              <div className="p-2 border border-[#1A1A1E] bg-[#0B0B0E]">
                <span className="text-[#71717A] block text-[8px] uppercase tracking-wider">TARGET SPACE</span>
                <span className="text-[#FFFFFF] font-bold">REC.709 / LOG</span>
              </div>
              <div className="p-2 border border-[#1A1A1E] bg-[#0B0B0E]">
                <span className="text-[#71717A] block text-[8px] uppercase tracking-wider">HOST NLE</span>
                <span className="text-[#00FF41] font-bold">DAVINCI & LUMETRI</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[9px] text-[#A1A1AA] pt-1 border-t border-[#16161A]">
              <span>CALIBRATION: VERIFIED STUDIO SPECTRAL RESPONSE</span>
              <span className="text-[#00FF41]">● SIGNAL LOCKED</span>
            </div>
          </div>
        ) : drop.categories?.slug === 'typography' ? (
          <div className="bg-[#060608] p-4 border border-[#222226] shadow-hardware-inset space-y-2">
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-[#FFFFFF] font-sans">
              THE QUICK BROWN FOX JUMPS OVER 123
            </div>
            <div className="flex items-center justify-between font-mono text-[9px] text-[#A1A1AA] pt-2 border-t border-[#16161A]">
              <span>FORMAT: OPENTYPE / TRUETYPE VARIABLE (400–800)</span>
              <span className="text-[#8B5CF6]">● SIL OFL-1.1 COMMERCIAL LICENSE</span>
            </div>
          </div>
        ) : (
          <div className="bg-[#060608] p-4 border border-[#222226] shadow-hardware-inset font-mono text-[10px] space-y-2">
            <div className="flex items-center justify-between text-[#FFFFFF]">
              <span>CANISTER SPEC: {drop.title}</span>
              <span className="text-[#00FF41]">STATUS: UNRESTRICTED</span>
            </div>
            <div className="text-[9px] text-[#71717A]">
              COMPATIBLE NLE: ADOBE PREMIERE PRO // DAVINCI RESOLVE // FINAL CUT PRO // AFTER EFFECTS
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
