'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { playClick } from '@/lib/audio/soundFx';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded border border-border/40 opacity-0" aria-hidden="true" />
    );
  }

  const isDark = resolvedTheme === 'dark';

  const toggleTheme = () => {
    playClick();
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={isDark ? 'Switch to Day Mode' : 'Switch to Dark Mode'}
      title={isDark ? 'Switch to Day Mode' : 'Switch to Dark Mode'}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-bold tracking-wider uppercase border border-border bg-surface-elevated hover:border-primary text-primary transition-all select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
    >
      {isDark ? (
        <>
          <Sun size={13} className="text-[#FBBF24]" />
          <span className="hidden sm:inline">DAY</span>
        </>
      ) : (
        <>
          <Moon size={13} className="text-[#6366F1]" />
          <span className="hidden sm:inline">NIGHT</span>
        </>
      )}
    </button>
  );
}
