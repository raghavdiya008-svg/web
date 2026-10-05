'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Download, Eye } from 'lucide-react';
import { useAudioArmed } from '@/lib/audioArmState';

interface VaultReelsProps {
  initialAssets: any[];
}

const CATEGORIES = [
  { id: 'all', label: 'All packs' },
  { id: 'luts', label: 'LUTs' },
  { id: 'sfx', label: 'Sound' },
  { id: 'overlays', label: 'Grain & Mattes' },
  { id: 'animations', label: 'Motion' },
  { id: 'typography', label: 'Typography' },
  { id: 'contracts', label: 'Contracts' },
];

const SWATCH_CLASSES: Record<string, string> = {
  all: 'bg-paper',
  luts: 'bg-macbeth-orange',
  sfx: 'bg-macbeth-cyan',
  overlays: 'bg-macbeth-neutral',
  animations: 'bg-macbeth-blue',
  typography: 'bg-macbeth-yellow',
  contracts: 'bg-macbeth-foliage',
};

const DEFAULT_PEAKS = [
  35, 42, 50, 48, 44, 38, 30, 25, 28, 35, 45, 55, 65, 72, 68, 60, 52, 45, 40, 36,
  32, 28, 25, 22, 20, 18, 16, 15, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14,
  14, 14, 14, 14, 14, 14, 14, 14,
];

export function VaultReels({ initialAssets }: VaultReelsProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState(0); // 0 to 1
  const [isAudioArmed] = useAudioArmed();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Loupe magnification state
  const [loupePos, setLoupePos] = useState<{ x: number; y: number; visible: boolean; targetUrl: string }>({
    x: 0,
    y: 0,
    visible: false,
    targetUrl: '',
  });

  const filteredAssets = initialAssets.filter((asset) => {
    if (activeCategory === 'all') return true;
    return asset.categories?.slug === activeCategory;
  });

  const handleAudioToggle = (assetId?: string, src?: string, seekPercent?: number) => {
    if (!assetId) {
      audioRef.current?.pause();
      setPlayingAudioId(null);
      setAudioProgress(0);
      return;
    }
    if (playingAudioId === assetId && seekPercent === undefined) {
      audioRef.current?.pause();
      setPlayingAudioId(null);
      setAudioProgress(0);
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      const audio = audioRef.current;
      if (src) audio.src = src;
      audio.ontimeupdate = () => {
        if (audio.duration) {
          setAudioProgress(audio.currentTime / audio.duration);
        }
      };
      audio.onended = () => {
        setPlayingAudioId(null);
        setAudioProgress(0);
      };
      audio.play().then(() => {
        if (seekPercent !== undefined && audio.duration) {
          audio.currentTime = seekPercent * audio.duration;
          setAudioProgress(seekPercent);
        }
      }).catch(() => {});
      setPlayingAudioId(assetId);
    }
  };

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>, assetId: string, src?: string) => {
    if (!src) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPercent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

    if (playingAudioId === assetId && audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = clickPercent * audioRef.current.duration;
      setAudioProgress(clickPercent);
    } else {
      handleAudioToggle(assetId, src, clickPercent);
    }
  };

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  return (
    <div className="w-full flex flex-col gap-10">
      {/* FILTER TABS (Sentence case, spring-physics gliding swatch) */}
      <div className="flex flex-wrap items-center gap-6 border-b border-white/10 pb-4">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          const swatchClass = SWATCH_CLASSES[cat.id] || 'bg-paper';
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`text-sm font-medium transition-colors relative pb-2 flex items-center gap-2 active:scale-[0.97] transition-transform duration-100 ${
                isActive ? 'text-paper font-semibold' : 'text-paper-dim hover:text-paper'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${swatchClass}`}
              />
              <span>{cat.label}</span>
              {isActive && (
                <motion.span
                  layoutId="activeCategoryPill"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  className={`absolute bottom-[-1px] left-0 right-0 h-0.5 rounded-full ${swatchClass}`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* REELS LIST */}
      <div className="flex flex-col gap-12">
        {filteredAssets.length === 0 ? (
          <div className="py-16 text-center text-paper-dim text-sm">
            No packs in this category yet. Next curated release lands soon.
          </div>
        ) : (
          filteredAssets.map((asset) => {
            const isLut = asset.categories?.slug === 'luts';
            const isSfx = asset.categories?.slug === 'sfx';
            const isGrain = asset.categories?.slug === 'overlays';
            const swatchClass = SWATCH_CLASSES[asset.categories?.slug] || 'bg-macbeth-orange';
            const peaks = asset.waveform_peaks || DEFAULT_PEAKS;

            return (
              <div
                key={asset.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6 border-b border-white/10 last:border-none"
              >
                {/* METADATA COLUMN (4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${swatchClass}`}
                    />
                    <span className="text-xs text-paper-dim capitalize">
                      {asset.categories?.name || 'Production Pack'}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-paper-dim">
                      {asset.license || 'CC0'}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-paper tracking-tight leading-snug">
                    {asset.title}
                  </h3>

                  <p className="text-sm text-paper-dim leading-relaxed line-clamp-2">
                    {asset.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-paper-muted pt-1">
                    <span>{asset.file_format?.toUpperCase()}</span>
                    <span>{(asset.file_size / 1024).toFixed(0)} KB</span>
                    {asset.compatible_software?.[0] && (
                      <span>Works in {asset.compatible_software[0]}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <a
                      href={`/api/download?dropId=${asset.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-paper text-monitor font-semibold text-xs rounded hover:bg-white active:scale-[0.96] transition-transform duration-100"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download pack
                    </a>
                    <Link
                      href={`/today?id=${asset.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-paper-dim hover:text-paper font-medium active:scale-[0.96] transition-transform duration-100"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Inspect details
                    </Link>
                  </div>
                </div>

                {/* ASSET INTERACTIVE REEL (8 cols) */}
                <div className="lg:col-span-8 bg-monitor rounded-monitor p-2 border border-white/10 overflow-hidden shadow-monitor">
                  {/* SFX REAL WAVEFORM REEL */}
                  {isSfx ? (
                    <div
                      onMouseEnter={() => {
                        if (isAudioArmed && playingAudioId !== asset.id) {
                          handleAudioToggle(asset.id, asset.preview_audio || '/media/EditX_Trailer_Braam_Low_Impact.wav');
                        }
                      }}
                      onMouseLeave={() => {
                        if (isAudioArmed && playingAudioId === asset.id) {
                          handleAudioToggle();
                        }
                      }}
                      className="h-36 w-full flex flex-col justify-between p-4 bg-gradient-to-r from-monitor to-suite-deep/30 rounded"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-macbeth-cyan font-semibold flex items-center gap-2">
                          <span
                            className={`w-1.5 h-1.5 rounded-full bg-macbeth-cyan ${
                              playingAudioId === asset.id ? 'animate-pulse' : ''
                            }`}
                          />
                          48kHz / 16-Bit Master Waveform
                        </span>
                        <button
                          onClick={() => handleAudioToggle(asset.id, asset.preview_audio || '/media/EditX_Trailer_Braam_Low_Impact.wav')}
                          className="flex items-center gap-2 px-3 py-1 rounded bg-macbeth-cyan/20 text-macbeth-cyan border border-macbeth-cyan/30 text-xs font-semibold hover:bg-macbeth-cyan/30 active:scale-[0.96] transition-transform duration-100"
                        >
                          {playingAudioId === asset.id ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5" /> Stop preview
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5" /> Play audio stem
                            </>
                          )}
                        </button>
                      </div>

                      {/* Interactive Waveform graphic bars with click-to-scrub */}
                      <div
                        onClick={(e) =>
                          handleWaveformClick(
                            e,
                            asset.id,
                            asset.preview_audio || '/media/EditX_Trailer_Braam_Low_Impact.wav'
                          )
                        }
                        title="Click anywhere to scrub audio"
                        className="relative h-16 flex items-center gap-1 overflow-hidden cursor-pointer group py-2"
                      >
                        {/* Real-time scrub needle */}
                        {playingAudioId === asset.id && (
                          <div
                            style={{ left: `${audioProgress * 100}%` }}
                            className="absolute top-0 bottom-0 w-0.5 bg-macbeth-cyan z-20 pointer-events-none shadow-[0_0_8px_#0885A1] transition-[left] duration-75"
                          >
                            <div className="w-1.5 h-1.5 -translate-x-[2px] bg-macbeth-cyan rounded-full" />
                          </div>
                        )}

                        {(peaks as number[]).map((height: number, i: number) => {
                          const isBarActive = playingAudioId === asset.id;
                          const isPast = isBarActive && (i / peaks.length) <= audioProgress;
                          return (
                            <div
                              key={i}
                              style={{ height: `${height}%` }}
                              className={`flex-1 rounded-full transition-all duration-100 ${
                                isPast
                                  ? 'bg-macbeth-cyan shadow-[0_0_4px_#0885A1]'
                                  : isBarActive
                                  ? 'bg-macbeth-cyan/40'
                                  : 'bg-white/20 group-hover:bg-white/35'
                              }`}
                            />
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-paper-muted">
                        <span>
                          {isAudioArmed
                            ? 'Audio monitoring active (Hover stem to preview)'
                            : 'Click waveform to scrub · 20Hz – 22kHz'}
                        </span>
                        <span>48kHz / 16-Bit Master WAV</span>
                      </div>
                    </div>
                  ) : isGrain ? (
                    /* GRAIN & MATTE REEL */
                    <div className="h-36 w-full relative flex items-center justify-center bg-zinc-900 rounded overflow-hidden">
                      <Image
                        src={asset.preview_image || '/media/EditX_4K_Matte_2.39_Anamorphic_Scope.png'}
                        alt={asset.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 700px"
                        className="object-cover opacity-80"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <span className="text-xs font-medium text-paper px-3 py-1 bg-black/70 rounded border border-white/10">
                          {asset.title}
                        </span>
                      </div>
                    </div>
                  ) : (
                    /* LUT SAMPLE STRIP (Drag or inspect) */
                    <div className="h-36 w-full flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                      {['/samples/skin_tone.svg', '/samples/night_exterior.svg', '/samples/daylight_landscape.svg', '/samples/colorchecker.svg'].map(
                        (sampleSrc, idx) => (
                          <div
                            key={idx}
                            className="relative h-full aspect-video rounded overflow-hidden shrink-0 border border-white/5 group cursor-pointer"
                          >
                            <Image
                              src={sampleSrc}
                              alt="Calibration frame"
                              fill
                              sizes="240px"
                              className="object-cover"
                            />
                            <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/70 text-[10px] text-paper-dim border border-white/5">
                              Frame {idx + 1}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
