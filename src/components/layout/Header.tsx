'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { isSfxMuted, toggleSfx, subscribeSfxChange, playClick, playHoverTick } from '@/lib/audio/soundFx';

const NAV_LINKS = [
  { href: '/vault', label: 'VAULT ARCHIVE' },
  { href: '/today', label: "TODAY'S DROP" },
  { href: '/submit', label: 'SUBMIT ASSET' },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    setMuted(isSfxMuted());
    const unsub = subscribeSfxChange((newMuted) => setMuted(newMuted));
    return unsub;
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleToggleSfx = () => {
    const nextMuted = toggleSfx();
    setMuted(nextMuted);
    if (!nextMuted) {
      playClick();
    }
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 h-14 border-b transition-all duration-200',
          scrolled
            ? 'bg-[#0A0A0C]/95 backdrop-blur-md border-[#1F1F24] shadow-[0_4px_25px_rgba(0,0,0,0.85)]'
            : 'bg-[#0A0A0C]/80 backdrop-blur-sm border-[#1F1F24]/60'
        )}
      >
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 h-full flex items-center justify-between">
          {/* LOGO */}
          <Link
            href="/"
            onClick={() => playClick()}
            className="flex items-center gap-3 group shrink-0"
          >
            <span className="font-display font-black text-lg tracking-[-0.03em] text-[#FFFFFF] uppercase">
              EDITX<span className="text-[#A1A1AA]">.VAULT</span>
            </span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 border border-[#27272A] bg-[#141417] text-[#FFFFFF] font-mono text-[8px] tracking-[0.2em] uppercase font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF] animate-pulse" />
              INDEX
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => playClick()}
                onMouseEnter={() => playHoverTick()}
                className={cn(
                  'text-xs font-mono font-bold tracking-[0.16em] transition-colors duration-150 uppercase',
                  pathname === href
                    ? 'text-[#FFFFFF] border-b border-[#FFFFFF] pb-0.5'
                    : 'text-[#A1A1AA] hover:text-[#FFFFFF]'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* DESKTOP CTA & HARDWARE SFX TOGGLE */}
          <div className="hidden md:flex items-center gap-4">
            {/* HARDWARE SFX TOGGLE SWITCH */}
            <button
              onClick={handleToggleSfx}
              onMouseEnter={() => playHoverTick()}
              aria-label={muted ? 'Unmute studio SFX' : 'Mute studio SFX'}
              title={muted ? 'Enable tactile sound FX' : 'Mute sound FX'}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-[9px] font-mono font-bold tracking-[0.16em] uppercase border border-[#27272A] bg-[#0E0E11] hover:border-[#FFFFFF] text-[#FFFFFF] transition-all select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
            >
              <span className={muted ? 'w-1.5 h-1.5 bg-[#52525B]' : 'w-1.5 h-1.5 bg-[#FFFFFF] animate-pulse'} />
              <span>AUDIO: {muted ? 'OFF' : 'ON'}</span>
            </button>

            <Link
              href="/vault"
              onClick={() => playClick()}
              className="text-xs font-mono text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors uppercase tracking-[0.14em] font-semibold"
            >
              ARCHIVE
            </Link>
            <a
              href="https://discord.gg/editx"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playClick()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-bold tracking-[0.16em] uppercase border border-[#FFFFFF] text-[#000000] bg-[#FFFFFF] hover:bg-[#E4E4E7] transition-all duration-150"
            >
              COMMUNITY ↗
            </a>
          </div>

          {/* MOBILE CONTROLS */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={handleToggleSfx}
              aria-label={muted ? 'Unmute studio SFX' : 'Mute studio SFX'}
              className="p-2 text-[#8A8A8E] hover:text-[#FFFFFF] transition-colors"
            >
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} className="text-[#FFFFFF]" />}
            </button>
            <button
              className="p-2 text-[#8A8A8E] hover:text-[#FFFFFF] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex flex-col bg-[#0A0A0C] pt-14 border-b border-[#1F1F24]">
          <div className="flex-1 flex flex-col p-6 space-y-2 border-t border-[#1F1F24]">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => playClick()}
                className={cn(
                  'py-4 text-base font-mono uppercase tracking-wider border-b border-[#1F1F24] transition-colors',
                  pathname === href ? 'text-[#FFFFFF] font-bold' : 'text-[#8A8A8E] hover:text-[#FFFFFF]'
                )}
              >
                {label}
              </Link>
            ))}
            <div className="pt-6 space-y-3">
              <button
                onClick={handleToggleSfx}
                className="w-full flex items-center justify-between px-4 py-3 border border-[#27272A] bg-[#141418] font-mono text-xs uppercase text-[#FFFFFF]"
              >
                <span>STUDIO AUDIO SFX</span>
                <span className="flex items-center gap-2">
                  <span className={muted ? 'w-1.5 h-1.5 bg-[#52525B]' : 'w-1.5 h-1.5 bg-[#FFFFFF] animate-pulse'} />
                  {muted ? 'MUTED' : 'ACTIVE'}
                </span>
              </button>
              <a
                href="https://discord.gg/editx"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playClick()}
                className="flex items-center justify-center gap-2 px-5 py-3 border border-[#FFFFFF] text-[#000000] bg-[#FFFFFF] font-mono text-sm tracking-wider uppercase font-bold"
              >
                JOIN DISCORD
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Spacer to offset fixed header */}
      <div className="h-14" />
    </>
  );
}