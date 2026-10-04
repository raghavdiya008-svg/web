'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const NAV_LINKS = [
  { href: '/today', label: "Today's Drop" },
  { href: '/vault', label: 'Vault Reels' },
  { href: '/submit', label: 'Submit Asset' },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 h-14 transition-colors duration-200',
          scrolled
            ? 'bg-suite/90 backdrop-blur-md border-b border-white/10'
            : 'bg-transparent border-b border-transparent'
        )}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 h-full flex items-center justify-between">
          {/* WORDMARK */}
          <Link
            href="/"
            className="flex items-center gap-2 group shrink-0"
          >
            <span className="font-bold text-lg tracking-tight text-paper">
              EditX Vault
            </span>
          </Link>

          {/* DESKTOP NAV (Sentence case, plain quiet links) */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'text-sm font-medium transition-colors duration-150',
                  pathname === href
                    ? 'text-paper font-semibold'
                    : 'text-paper-dim hover:text-paper'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* MOBILE MENU TOGGLE */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-paper-dim hover:text-paper"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-suite-deep/95 backdrop-blur-md pt-20 px-6 flex flex-col gap-6 md:hidden">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'text-lg py-2 border-b border-white/10',
                pathname === href ? 'text-paper font-semibold' : 'text-paper-dim'
              )}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}