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
      title={isDark ? 'Switch to Day Mode (Clean White Paper)' : 'Switch to Dark Mode (Technical Terminal)'}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-mono font-bold tracking-[0.14em] uppercase border border-[#27272A] dark:border-[#27272A] light:border-[#D4D4D8] bg-[#0E0E11] dark:bg-[#0E0E11] light:bg-[#F4F4F5] hover:border-[#FFFFFF] dark:hover:border-[#FFFFFF] text-[#FFFFFF] dark:text-[#FFFFFF] light:text-[#18181B] transition-all select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current"
    >
      {isDark ? (
        <>
          <Sun size={11} className="text-[#FBBF24]" />
          <span className="hidden sm:inline">DAY</span>
        </>
      ) : (
        <>
          <Moon size={11} className="text-[#6366F1]" />
          <span className="hidden sm:inline">NIGHT</span>
        </>
      )}
    </button>
  );
}
