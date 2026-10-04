import { Metadata } from 'next';
import Link from 'next/link';
import { WebglLutViewer } from '@/components/vault/WebglLutViewer';
import { VaultReels } from '@/components/vault/VaultReels';
import { TimelineBar } from '@/components/layout/TimelineBar';
import { EDITX_VAULT_CATALOG } from '@/data/vault_catalog';
import { Download, ArrowDown } from 'lucide-react';

export const metadata: Metadata = {
  title: 'EditX Vault — Open Creative Assets for Video Editors & Animators',
  description:
    'Free production LUTs, analog sound stems, 4K film mattes, and motion assets. Calibrated 18% neutral grading suite environment. Zero paywalls.',
};

export default function HomePage() {
  const liveDrop = EDITX_VAULT_CATALOG[0]; // Kodak Vision3 5219
  const catalogAssets = EDITX_VAULT_CATALOG;

  return (
    <div className="w-full min-h-screen bg-suite text-paper pb-24 selection:bg-tally/30 selection:text-paper">
      {/* ============================================================
          SECTION 1: HERO (Intro & Live Footage Monitor)
          ============================================================ */}
      <section
        id="hero"
        className="max-w-[1440px] mx-auto px-6 lg:px-10 pt-28 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
      >
        {/* LEFT COLUMN: HERO HEADLINE & MANIFESTO */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-paper">
              Free footage tools for people who cut.
            </h1>
            <p className="text-lg text-paper-dim leading-relaxed max-w-lg">
              Color-science LUTs, analog audio stems, 4K film mattes, and motion suites. A new curated pack released every day at 14:00 UTC. 100% free under CC0 and MIT licenses.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#today"
              className="inline-flex items-center gap-2 px-6 py-3 bg-paper text-monitor font-semibold rounded hover:bg-white transition-colors"
            >
              Get today&apos;s pack
              <ArrowDown className="w-4 h-4" />
            </a>
            <a
              href="#vault"
              className="px-5 py-3 text-sm font-medium text-paper-dim hover:text-paper transition-colors"
            >
              Inspect the vault reels
            </a>
          </div>

          {/* COLORCHECKER CALIBRATION STRIP */}
          <div className="pt-6 border-t border-white/10 flex items-center gap-3 text-xs text-paper-muted">
            <span>Calibrated against Macbeth target:</span>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-macbeth-orange" title="LUTs" />
              <span className="w-3 h-3 rounded-sm bg-macbeth-cyan" title="Audio" />
              <span className="w-3 h-3 rounded-sm bg-macbeth-neutral" title="Grain" />
              <span className="w-3 h-3 rounded-sm bg-macbeth-blue" title="Motion" />
              <span className="w-3 h-3 rounded-sm bg-macbeth-yellow" title="Typography" />
              <span className="w-3 h-3 rounded-sm bg-macbeth-foliage" title="Contracts" />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE WEBGL LUT MONITOR */}
        <div className="lg:col-span-7">
          <WebglLutViewer
            cubeUrl="/media/EditX_Kodak_Vision3_5219.cube"
            title="Kodak Vision3 5219 Emulation"
            showClipSwitcher={true}
          />
        </div>
      </section>

      {/* ============================================================
          SECTION 2: TODAY'S DROP (Full-bleed live inspect & direct download)
          ============================================================ */}
      <section
        id="today"
        className="max-w-[1440px] mx-auto px-6 lg:px-10 py-20 border-t border-white/10"
      >
        <div className="flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-macbeth-orange" />
                <span className="text-xs font-semibold uppercase tracking-wider text-macbeth-orange">
                  Today&apos;s Featured Release
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-paper">
                {liveDrop.title}
              </h2>
            </div>
            <div className="text-xs text-paper-dim sm:text-right">
              Next curated release drops in <span className="text-paper font-semibold">14h 22m</span>
            </div>
          </div>

          {/* LARGE MONITOR VIEW */}
          <div className="w-full">
            <WebglLutViewer
              cubeUrl="/media/EditX_Kodak_Vision3_5219.cube"
              defaultClip="/samples/skin_tone.svg"
              title="Kodak Vision3 5219"
              showClipSwitcher={false}
            />
          </div>

          {/* SPECS & DIRECT DOWNLOAD */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-4">
            <div className="md:col-span-8 space-y-2">
              <p className="text-paper-dim text-base leading-relaxed">
                {liveDrop.description}
              </p>
              <div className="flex flex-wrap items-center gap-6 text-xs text-paper-muted pt-2">
                <div>Format: <span className="text-paper font-medium">33x33x33 .CUBE</span></div>
                <div>Size: <span className="text-paper font-medium">366 KB</span></div>
                <div>License: <span className="text-paper font-medium">CC0 (No attribution needed)</span></div>
                <div>Compatible: <span className="text-paper font-medium">Resolve, Premiere, FCP, CapCut</span></div>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col gap-3">
              <a
                href="/api/download?dropId=v-02"
                className="w-full py-3.5 bg-paper text-monitor text-center font-bold text-sm rounded hover:bg-white transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Kodak 5219 Suite (.zip)
              </a>
              <span className="text-[11px] text-paper-muted text-center">
                Free for commercial and personal work.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 3: THE VAULT REELS
          ============================================================ */}
      <section
        id="vault"
        className="max-w-[1440px] mx-auto px-6 lg:px-10 py-20 border-t border-white/10"
      >
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-paper mb-2">
              The Vault Archive
            </h2>
            <p className="text-paper-dim text-sm max-w-xl">
              Inspect past releases as full-width asset reels. Real waveforms, uncompressed LUT strips, and 4K mattes.
            </p>
          </div>

          <VaultReels initialAssets={catalogAssets} />
        </div>
      </section>

      {/* ============================================================
          SECTION 4: WHY IT'S FREE
          ============================================================ */}
      <section
        id="why"
        className="max-w-[1440px] mx-auto px-6 lg:px-10 py-20 border-t border-white/10"
      >
        <div className="max-w-2xl space-y-4">
          <h2 className="text-2xl font-bold text-paper tracking-tight">
            Why EditX Vault is free
          </h2>
          <p className="text-base text-paper-dim leading-relaxed">
            Most creative asset sites lock basic utilities behind expensive subscription tiers or force you through ads and countdown gates. EditX Vault is operated by an independent post-production studio to share studio-grade building blocks directly with creators. No paywalls, no watermarks, and no rights restrictions.
          </p>
          <div className="pt-2">
            <a
              href="https://discord.gg/mHAhsUYDtt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-paper underline underline-offset-4 hover:text-white"
            >
              Join the studio Discord community →
            </a>
          </div>
        </div>
      </section>

      {/* PINNED TIMELINE PLAYHEAD BAR */}
      <TimelineBar />
    </div>
  );
}
