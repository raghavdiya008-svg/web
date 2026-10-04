'use client';
import { useState, useEffect } from 'react';
import { Play, Volume2, VolumeX } from 'lucide-react';

interface TimelineSection {
  id: string;
  label: string;
  color: string;
}

const SECTIONS: TimelineSection[] = [
  { id: 'hero', label: 'Intro', color: '#5A5A5C' },
  { id: 'today', label: "Today's Drop", color: '#D67E2C' },
  { id: 'vault', label: 'Vault Reels', color: '#505BA6' },
  { id: 'why', label: "Why It's Free", color: '#576C43' },
];

export function TimelineBar() {
  const [scrollProgress, setScrollProgress] = useState(0); // 0 to 1
  const [audioArmed, setAudioArmed] = useState(false);
  const [timecode, setTimecode] = useState('00:00:00:00');

  useEffect(() => {
    let ticking = false;
    const updateScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = docHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / docHeight)) : 0;
          setScrollProgress(progress);

          // 24fps real SMPTE calculation based on scroll
          const totalFrames = Math.floor(progress * 1440); // 60s @ 24fps
          const frames = totalFrames % 24;
          const totalSeconds = Math.floor(totalFrames / 24);
          const seconds = totalSeconds % 60;
          const minutes = Math.floor(totalSeconds / 60) % 60;
          const hours = Math.floor(totalSeconds / 3600);

          const pad = (n: number) => n.toString().padStart(2, '0');
          setTimecode(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`);

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside
      aria-label="Playback timeline"
      className="fixed bottom-0 left-0 right-0 z-[100] h-10 bg-suite-deep/95 backdrop-blur-md border-t border-white/10 px-4 flex items-center justify-between text-xs select-none shadow-2xl"
    >
      {/* TIMECODE & RECORD ARM BUTTON */}
      <div className="flex items-center gap-3">
        {/* Record Arm Button */}
        <button
          onClick={() => setAudioArmed(!audioArmed)}
          title={audioArmed ? 'Audio Armed (Click to mute)' : 'Arm Audio (Click to allow sound previews)'}
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
            audioArmed
              ? 'bg-tally text-paper animate-pulse'
              : 'bg-white/5 text-paper-dim hover:text-paper'
          }`}
          aria-label={audioArmed ? 'Mute audio' : 'Arm audio'}
        >
          <span
            className={`w-2 h-2 rounded-full ${audioArmed ? 'bg-paper' : 'bg-tally'}`}
          />
          <span className="hidden sm:inline">{audioArmed ? 'ARMED' : 'ARM AUDIO'}</span>
        </button>

        {/* 24fps SMPTE Timecode */}
        <span className="tabular-nums font-mono text-paper-dim tracking-wider font-semibold">
          {timecode}
        </span>
      </div>

      {/* TIMELINE TRACK & CLIPS */}
      <div className="relative flex-1 max-w-xl mx-4 h-5 bg-suite rounded-clip overflow-hidden flex items-center p-0.5 border border-white/5">
        {SECTIONS.map((sec, i) => (
          <button
            key={sec.id}
            onClick={() => scrollToSection(sec.id)}
            className="h-full flex-1 mx-0.5 rounded-[2px] text-[10px] text-paper-dim font-medium truncate flex items-center justify-center transition-opacity hover:opacity-100 opacity-75"
            style={{ backgroundColor: `${sec.color}40`, borderLeft: `2px solid ${sec.color}` }}
            title={`Jump to ${sec.label}`}
            aria-label={`Jump to ${sec.label} section`}
          >
            <span className="hidden md:inline">{sec.label}</span>
          </button>
        ))}

        {/* RED PLAYHEAD */}
        <div
          style={{ left: `${scrollProgress * 100}%` }}
          className="absolute top-0 bottom-0 w-0.5 bg-tally z-20 pointer-events-none transition-all duration-75 shadow-[0_0_6px_#E5322D]"
        >
          <div className="w-2 h-1 bg-tally -translate-x-[3px] rounded-b-sm" />
        </div>
      </div>

      {/* QUICK STATUS */}
      <div className="hidden sm:flex items-center gap-2 text-paper-muted text-[11px]">
        <span>24 FPS</span>
        <span className="w-1 h-1 rounded-full bg-paper-muted" />
        <span>REC.709</span>
      </div>
    </aside>
  );
}
