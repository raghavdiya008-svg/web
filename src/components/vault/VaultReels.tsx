'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Volume2, VolumeX, Download, Eye } from 'lucide-react';

interface VaultReelsProps {
  initialAssets: any[];
}

const CATEGORIES = [
  { id: 'all', label: 'All packs', color: '#F2F1EE' },
  { id: 'luts', label: 'LUTs', color: '#D67E2C' },
  { id: 'sfx', label: 'Sound', color: '#0885A1' },
  { id: 'overlays', label: 'Grain & Mattes', color: '#A0A0A0' },
  { id: 'animations', label: 'Motion', color: '#505BA6' },
  { id: 'typography', label: 'Typography', color: '#E7C71F' },
  { id: 'contracts', label: 'Contracts', color: '#576C43' },
];

export function VaultReels({ initialAssets }: VaultReelsProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
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

  const handleAudioToggle = (assetId: string, src?: string) => {
    if (!src) return;
    if (playingAudioId === assetId) {
      audioRef.current?.pause();
      setPlayingAudioId(null);
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      audioRef.current.src = src;
      audioRef.current.play().catch(() => {});
      audioRef.current.onended = () => setPlayingAudioId(null);
      setPlayingAudioId(assetId);
    }
  };

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  return (
    <div className="w-full flex flex-col gap-10">
      {/* FILTER TABS (Sentence case, color swatch underline) */}
      <div className="flex flex-wrap items-center gap-6 border-b border-white/10 pb-4">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`text-sm font-medium transition-colors relative pb-1 flex items-center gap-2 ${
                isActive ? 'text-paper font-semibold' : 'text-paper-dim hover:text-paper'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              {cat.label}
              {isActive && (
                <span
                  style={{ backgroundColor: cat.color }}
                  className="absolute bottom-[-17px] left-0 right-0 h-0.5 rounded-full"
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
            const swatch = asset.categories?.color || '#D67E2C';

            return (
              <div
                key={asset.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6 border-b border-white/10 last:border-none"
              >
                {/* METADATA COLUMN (4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: swatch }}
                    />
                    <span className="text-xs text-paper-dim capitalize">
                      {asset.categories?.name || 'Production Pack'}
                    </span>
                    <span className="text-xs text-paper-muted">· {asset.license || 'CC0'}</span>
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
                      className="inline-flex items-center gap-2 px-4 py-2 bg-paper text-monitor font-semibold text-xs rounded hover:bg-white transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download pack
                    </a>
                    <Link
                      href={`/today?id=${asset.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-paper-dim hover:text-paper font-medium"
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
                    <div className="h-36 w-full flex flex-col justify-between p-4 bg-gradient-to-r from-monitor to-suite-deep/30 rounded">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-macbeth-cyan font-semibold flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-macbeth-cyan animate-pulse" />
                          24-Bit / 48kHz Master Waveform
                        </span>
                        <button
                          onClick={() => handleAudioToggle(asset.id, asset.preview_audio || '/media/EditX_Trailer_Braam_Low_Impact.wav')}
                          className="flex items-center gap-2 px-3 py-1 rounded bg-macbeth-cyan/20 text-macbeth-cyan border border-macbeth-cyan/30 text-xs font-semibold hover:bg-macbeth-cyan/30 transition-colors"
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

                      {/* Waveform graphic bars */}
                      <div className="h-16 flex items-center gap-1 overflow-hidden">
                        {Array.from({ length: 48 }).map((_, i) => {
                          const height = Math.max(
                            15,
                            Math.sin(i * 0.25) * 45 + Math.cos(i * 0.4) * 20 + 35
                          );
                          const isBarActive = playingAudioId === asset.id;
                          return (
                            <div
                              key={i}
                              style={{ height: `${height}%` }}
                              className={`flex-1 rounded-full transition-all duration-150 ${
                                isBarActive
                                  ? 'bg-macbeth-cyan opacity-90'
                                  : 'bg-white/20 hover:bg-white/40'
                              }`}
                            />
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-paper-muted">
                        <span>Frequency Range: 20Hz – 22kHz</span>
                        <span>48kHz Master / 16-Bit WAV</span>
                      </div>
                    </div>
                  ) : isGrain ? (
                    /* GRAIN & MATTE REEL */
                    <div className="h-36 w-full relative flex items-center justify-center bg-zinc-900 rounded overflow-hidden">
                      <img
                        src={asset.preview_image || '/media/EditX_4K_Matte_2.39_Anamorphic_Scope.png'}
                        alt={asset.title}
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <span className="text-xs font-medium text-paper px-3 py-1 bg-black/70 rounded">
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
                            <img
                              src={sampleSrc}
                              alt="Calibration frame"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/70 text-[10px] text-paper-dim">
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
