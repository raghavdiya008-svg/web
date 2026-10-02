'use client';
import Link from 'next/link';
import { Activity, ShieldCheck, Terminal, Disc } from 'lucide-react';

const LINKS = [
  { href: '/legal/terms', label: 'TERMS' },
  { href: '/legal/privacy', label: 'PRIVACY' },
  { href: '/legal/licenses', label: 'LICENSES' },
  { href: '/legal/dmca', label: 'DMCA' },
  { href: '/vault', label: 'ARCHIVE REEL' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[#1F1F24] bg-[#070708]">
      
      {/* ============================================================
          SYSTEM STATUS & TELEMETRY DIAGNOSTICS PANEL
          ============================================================ */}
      <div className="border-b border-[#1F1F24] bg-[#0A0A0C] px-5 lg:px-8 py-3.5">
        <div className="max-w-[1280px] mx-auto flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-[#FFFFFF]" />
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] font-black text-[#FFFFFF] uppercase tracking-[0.2em]">
                DIAGNOSTICS // REPO-CORE
              </span>
            </div>
          </div>

          {/* TELEMETRY READOUTS */}
          <div className="flex flex-wrap items-center gap-6 font-mono text-[9px] text-[#A1A1AA]">
            <div className="flex items-center gap-1.5">
              <span className="text-[#52525B]">UPTIME:</span>
              <span className="text-[#FFFFFF] font-bold">99.98%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#52525B]">USERS:</span>
              <span className="text-[#FFFFFF] font-bold">2,480 ONLINE</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#52525B]">RELEASE:</span>
              <span className="text-[#FFFFFF] font-bold">2026.10-STABLE</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#52525B]">LATENCY:</span>
              <span className="text-[#FFFFFF]">18ms</span>
            </div>
          </div>

        </div>
      </div>

      {/* MAIN FOOTER CHASSIS */}
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8 py-12 space-y-8">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          
          {/* BRAND WORDMARK & CHASSIS SPEC */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-3 group">
              <span className="font-display font-black text-lg tracking-tight text-[#FFFFFF] uppercase">
                EDITX<span className="text-[#A1A1AA]">.VAULT</span>
              </span>
              <span className="px-2 py-0.5 border border-[#27272A] text-[#A1A1AA] bg-[#141417] font-mono text-[8px] tracking-[0.16em] uppercase font-bold">
                OPEN REPOSITORY
              </span>
            </Link>
            <p className="text-xs text-[#A1A1AA] font-mono max-w-sm leading-relaxed">
              Open creative asset repository for 3D/VFX animators, editors, and technical artists. Curated daily drops under open-source licenses.
            </p>
          </div>

          {/* TELEMETRY LINKS & DISCORD INTEGRATION */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-xs text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors font-mono tracking-wider font-semibold"
                >
                  {label}
                </Link>
              ))}
            </nav>

            <a
              href="https://discord.gg/editx"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#FFFFFF] text-[#000000] font-mono text-xs font-black uppercase tracking-wider transition-colors hover:bg-[#E4E4E7]"
            >
              COMMUNITY RELAY ↗
            </a>
          </div>

        </div>

        {/* BOTTOM STAMP */}
        <div className="pt-6 border-t border-[#1F1F24] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[10px] font-mono text-[#52525B]">
          <p suppressHydrationWarning>
            © {year} EDITX VAULT // ALL ASSETS LICENSED UNDER OPEN CREATIVE COMMONS & MIT.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#FFFFFF]" />
            <span className="text-[#A1A1AA]">SWISS EDITORIAL SYSTEM</span>
          </div>
        </div>

      </div>

    </footer>
  );
}