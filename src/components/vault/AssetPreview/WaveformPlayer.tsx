'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { playClick, playHoverTick } from '@/lib/audio/soundFx';
import { useSmpteTimecode } from '@/hooks/useSmpteTimecode';

interface WaveformPlayerProps {
  audioUrl?: string;
  className?: string;
  height?: number;
  title?: string;
  onPlayStateChange?: (playing: boolean) => void;
}

export function WaveformPlayer({
  audioUrl,
  className,
  height = 96,
  title = 'CINEMATIC SUB BASS & BRAAM SUITE #01',
  onPlayStateChange,
}: WaveformPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(25);
  const [hoverPos, setHoverPos] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'analyser' | 'spectrogram'>('analyser');
  const prefersReduced = useReducedMotion();
  
  const timecode = useSmpteTimecode(0, 0, 14, 21);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<AudioNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    onPlayStateChange?.(isPlaying);
  }, [isPlaying, onPlayStateChange]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !prefersReduced) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.8));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, prefersReduced]);

  const stopAudio = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (sourceNodeRef.current) {
      try {
        (sourceNodeRef.current as any).stop?.();
        sourceNodeRef.current.disconnect();
      } catch {}
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    return () => {
      stopAudio();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    };
  }, [stopAudio]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        if (width > 0) {
          canvas.width = width;
          canvas.height = height;
        }
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [height]);

  const drawAnalyser = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser ? analyser.frequencyBinCount : 32;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      if (!isPlayingRef.current) return;
      if (!prefersReduced) animFrameRef.current = requestAnimationFrame(render);

      if (analyser) {
        analyser.getByteFrequencyData(dataArray);
      } else {
        for (let i = 0; i < bufferLength; i++) {
          dataArray[i] = Math.floor(60 + Math.random() * 140);
        }
      }

      const width = canvas.width;
      const canvasHeight = canvas.height;
      const centerY = canvasHeight / 2;

      ctx.clearRect(0, 0, width, canvasHeight);

      ctx.strokeStyle = 'rgba(179, 179, 186, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      const numBars = Math.min(bufferLength, 48);
      const barSpacing = 3;
      const totalSpacing = (numBars - 1) * barSpacing;
      const barWidth = Math.max(2, (width - totalSpacing) / numBars);

      for (let i = 0; i < numBars; i++) {
        const val = dataArray[i] / 255;
        const barHeight = Math.max(3, val * (centerY - 4));
        const x = i * (barWidth + barSpacing);

        const grad = ctx.createLinearGradient(x, centerY - barHeight, x, centerY + barHeight);
        grad.addColorStop(0, 'var(--color-accent)');
        grad.addColorStop(0.5, 'transparent');
        grad.addColorStop(1, 'var(--color-accent)');

        ctx.fillStyle = grad;
        ctx.shadowColor = 'var(--color-accent)';
        ctx.shadowBlur = val > 0.7 ? 8 : 2;

        ctx.fillRect(x, centerY - barHeight, barWidth, barHeight);
        ctx.fillRect(x, centerY, barWidth, barHeight);
      }
      ctx.shadowBlur = 0;
    };

    render();
  }, [prefersReduced]);

  const startAudio = useCallback(() => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const subOsc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(55, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(32, ctx.currentTime + 3.0);

      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(55.8, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(32.4, ctx.currentTime + 3.0);

      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(45, ctx.currentTime);
      subOsc.frequency.exponentialRampToValueAtTime(28, ctx.currentTime + 3.0);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 3.0);
      filter.Q.value = 4.5;

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.2);

      osc1.connect(filter);
      osc2.connect(filter);
      subOsc.connect(gain);
      filter.connect(gain);

      gain.connect(analyser);
      analyser.connect(ctx.destination);

      osc1.start();
      osc2.start();
      subOsc.start();

      osc1.stop(ctx.currentTime + 3.3);
      osc2.stop(ctx.currentTime + 3.3);
      subOsc.stop(ctx.currentTime + 3.3);

      sourceNodeRef.current = osc1;
      setIsPlaying(true);

      osc1.onended = () => {
        setIsPlaying(false);
      };

      setTimeout(() => {
        drawAnalyser();
      }, 20);
    } catch (e) {
      setIsPlaying(true);
    }
  }, [drawAnalyser]);

  const togglePlay = () => {
    playClick();
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  return (
    <div className={cn('metal-chassis p-5 space-y-4 border border-border shadow-md', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 bg-primary" />
          <div className="flex items-center gap-2">
            <span className={cn('w-2 h-2 rounded-full transition-all', isPlaying ? 'bg-accent animate-pulse' : 'bg-primary')} />
            <span className="font-mono text-[12px] font-extrabold text-primary uppercase">
              DAW AUDIO ENGINE // 24-BIT STEMS
            </span>
          </div>
          <span className="text-border">/</span>
          <span className="font-mono text-[12px] text-muted uppercase">
            {isPlaying ? 'ENGINE ACTIVE' : 'STANDBY'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center border border-border bg-surface p-0.5">
            <button
              onClick={() => { playClick(); setViewMode('analyser'); }}
              onMouseEnter={() => playHoverTick()}
              className={cn(
                'px-3 py-0.5 font-mono text-[12px] font-bold uppercase transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
                viewMode === 'analyser' ? 'bg-surface-elevated text-primary border border-border' : 'text-muted hover:text-primary'
              )}
            >
              Waveform
            </button>
            <button
              onClick={() => { playClick(); setViewMode('spectrogram'); }}
              onMouseEnter={() => playHoverTick()}
              className={cn(
                'px-3 py-0.5 font-mono text-[12px] font-bold uppercase transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
                viewMode === 'spectrogram' ? 'bg-surface-elevated text-primary border border-border' : 'text-muted hover:text-primary'
              )}
            >
              Spectrogram
            </button>
          </div>

          <div className="font-mono text-[12px] text-primary bg-background px-3 py-1 border border-border tabular-nums font-bold">
            {timecode}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch gap-4">
        <button
          onClick={togglePlay}
          onMouseEnter={() => playHoverTick()}
          aria-label={isPlaying ? 'Pause preview audio' : 'Play preview audio'}
          className={cn(
            'shrink-0 w-full sm:w-16 min-h-[96px] border bg-surface flex sm:flex-col items-center justify-center gap-2 cursor-pointer select-none transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent py-4 sm:py-0',
            isPlaying ? 'border-accent text-accent shadow-[0_0_16px_var(--color-accent)]' : 'border-border text-primary hover:border-primary'
          )}
        >
          <span className={cn('w-2 h-2 rounded-full', isPlaying ? 'bg-accent animate-pulse' : 'bg-primary')} />
          {isPlaying ? <Pause size={18} className="fill-current" /> : <Play size={18} className="fill-current translate-x-0.5" />}
          <span className="font-mono text-[12px] font-black uppercase">
            {isPlaying ? 'ACTIVE' : 'PLAY'}
          </span>
        </button>

        <div
          ref={containerRef}
          role="slider"
          aria-label="Audio timeline scrubber"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
              e.preventDefault();
              setProgress((prev) => Math.min(100, prev + 2));
              playClick();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
              e.preventDefault();
              setProgress((prev) => Math.max(0, prev - 2));
              playClick();
            }
          }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const pct = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
            setHoverPos(pct);
          }}
          onMouseLeave={() => setHoverPos(null)}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const newProgress = Math.round((clickX / rect.width) * 100);
            setProgress(Math.max(0, Math.min(100, newProgress)));
            playClick();
          }}
          className="relative flex-1 min-h-[96px] bg-background border border-border overflow-hidden cursor-crosshair group select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
        >
          {viewMode === 'spectrogram' ? (
            <div className="absolute inset-0 flex flex-col justify-between py-1.5 px-2 overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(var(--color-text-primary)_1px,transparent_1px)] [background-size:6px_6px]" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(16,16,24,0.85) 0%, rgba(255,74,28,0.3) 50%, rgba(255,255,255,0.2) 100%)' }} />
              <div className={cn("absolute inset-y-0 w-28 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none", !prefersReduced && 'animate-scanline')} />
              <div className="relative z-10 flex justify-between font-mono text-[12px] text-muted uppercase">
                <span>SUB 20Hz - 60Hz</span>
                <span>MID 1.2kHz</span>
                <span>HIGH AIR 18kHz</span>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {isPlaying ? (
                  <motion.div key="live-canvas" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 w-full h-full flex items-center justify-center">
                    <canvas ref={canvasRef} className="w-full h-full" />
                  </motion.div>
                ) : (
                  <motion.div key="static-waveform" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 px-3 flex items-center justify-between gap-[2px]">
                    {Array.from({ length: 54 }).map((_, i) => {
                      const waveH = Math.round(22 + Math.sin(i * 0.35) * 44 + Math.cos(i * 0.8) * 24);
                      const isPassed = (i / 54) * 100 <= progress;
                      return (
                        <div key={i} className={cn('flex-1 transition-colors duration-100', isPassed ? 'bg-accent shadow-[0_0_4px_var(--color-accent)]' : 'bg-surface-elevated')} style={{ height: `${Math.min(94, Math.max(12, waveH))}%` }} />
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <div className="absolute top-0 bottom-0 w-[2px] bg-accent pointer-events-none transition-all duration-75 shadow-[0_0_8px_var(--color-accent)] z-20" style={{ left: `${progress}%` }}>
            <div className="absolute top-0 -left-1 w-2.5 h-2.5 bg-accent" />
            <div className="absolute bottom-0 -left-1 w-2.5 h-2.5 bg-accent" />
          </div>

          {hoverPos !== null && (
            <div className="absolute top-0 bottom-0 w-[1.5px] bg-primary/70 pointer-events-none shadow-[0_0_6px_var(--color-text-primary)] z-20" style={{ left: `${hoverPos}%` }}>
              <div className="absolute -top-1 -translate-x-1/2 font-mono text-[12px] text-primary bg-background px-1 border border-primary">
                {Math.round(hoverPos)}%
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pt-2 border-t border-border flex flex-col md:flex-row items-center justify-between gap-2 text-[12px] font-mono text-muted">
        <span className="font-bold text-primary">48KHZ · 24-BIT PCM · MIT LICENSE</span>
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-surface border border-border text-accent font-bold">
          <span className="w-1.5 h-1.5 bg-accent animate-pulse" />
          <span>⚡ SFX ENGINE #01</span>
        </div>
      </div>
    </div>
  );
}