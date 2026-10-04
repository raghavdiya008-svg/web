import Link from 'next/link';

const LINKS = [
  { href: '/legal/terms', label: 'Terms' },
  { href: '/legal/privacy', label: 'Privacy' },
  { href: '/legal/licenses', label: 'Licenses' },
  { href: '/legal/dmca', label: 'DMCA' },
  { href: '/vault', label: 'Archive' },
  { href: '/submit', label: 'Submit Asset' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/10 bg-suite-deep text-paper-dim pb-16">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="space-y-2">
          <Link href="/" className="font-bold text-lg text-paper tracking-tight">
            EditX Vault
          </Link>
          <p className="text-sm text-paper-dim max-w-md leading-relaxed">
            Curated daily creative assets for video editors, colorists, and motion designers. 100% free under CC0 and MIT licenses.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <nav className="flex flex-wrap items-center gap-6">
            {LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-paper-dim hover:text-paper transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          <a
            href="https://discord.gg/mHAhsUYDtt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-paper text-monitor text-sm font-semibold rounded hover:bg-white transition-colors"
          >
            Discord community
          </a>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-paper-muted">
        <div>© {year} EditX Vault Studio. Calibrated for sRGB and Rec.709.</div>
        <div>New drop every day at 14:00 UTC.</div>
      </div>
    </footer>
  );
}