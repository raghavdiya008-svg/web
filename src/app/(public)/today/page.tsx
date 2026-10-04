import { Metadata } from 'next';
import { WebglLutViewer } from '@/components/vault/WebglLutViewer';
import { TimelineBar } from '@/components/layout/TimelineBar';
import { EDITX_VAULT_CATALOG } from '@/data/vault_catalog';
import { Download, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: "Today's Drop — Kodak Vision3 5219 Emulation Suite | EditX Vault",
  description:
    'Download the Kodak Vision3 5219 33-point 3D LUT suite. Tested and calibrated for DaVinci Resolve and Adobe Premiere Pro.',
};

export default function TodayDropPage() {
  const asset = EDITX_VAULT_CATALOG[0];

  return (
    <div className="w-full min-h-screen bg-suite text-paper pt-24 pb-28">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 flex flex-col gap-12">
        {/* VIEWING ROOM HEADER */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-macbeth-orange" />
            <span className="text-xs font-semibold text-macbeth-orange uppercase tracking-wider">
              Viewing Room · Today&apos;s Specimen
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-paper">
            {asset.title}
          </h1>
          <p className="text-base text-paper-dim max-w-2xl leading-relaxed">
            {asset.description}
          </p>
        </div>

        {/* 75VH MONITOR (WebGL Interactive LUT test bench) */}
        <div className="w-full">
          <WebglLutViewer
            cubeUrl="/media/EditX_Kodak_Vision3_5219.cube"
            title="Kodak Vision3 5219"
            showClipSwitcher={true}
          />
        </div>

        {/* SPEC & DOWNLOAD CHASSIS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4 border-t border-white/10">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-xl font-bold text-paper">How to apply in your NLE</h2>
            <div className="space-y-4 text-sm text-paper-dim">
              <div className="p-4 rounded bg-suite-deep/60 border border-white/5 space-y-1">
                <div className="font-semibold text-paper flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-macbeth-orange" />
                  DaVinci Resolve Workflow
                </div>
                <p className="text-xs text-paper-dim">
                  Project Settings &gt; Color Management &gt; Open LUT Folder. Copy the `.cube` file into the folder, click &quot;Update Lists&quot;, and apply on a final grading node.
                </p>
              </div>

              <div className="p-4 rounded bg-suite-deep/60 border border-white/5 space-y-1">
                <div className="font-semibold text-paper flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-macbeth-orange" />
                  Adobe Premiere Pro Workflow
                </div>
                <p className="text-xs text-paper-dim">
                  In Lumetri Color workspace, select the &quot;Creative&quot; panel &gt; Look dropdown &gt; Browse. Select the `.cube` file and adjust intensity as desired.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-4 bg-suite-deep p-6 rounded-monitor border border-white/10">
            <div className="text-sm font-semibold text-paper">Asset Specifications</div>
            <div className="space-y-2 text-xs text-paper-dim border-b border-white/10 pb-4">
              <div className="flex justify-between">
                <span>File Format:</span>
                <span className="text-paper font-medium">33x33x33 .CUBE</span>
              </div>
              <div className="flex justify-between">
                <span>Color Space:</span>
                <span className="text-paper font-medium">Rec.709 &amp; Arri Log-C</span>
              </div>
              <div className="flex justify-between">
                <span>Download Size:</span>
                <span className="text-paper font-medium">366.2 KB</span>
              </div>
              <div className="flex justify-between">
                <span>License:</span>
                <span className="text-paper font-medium">CC0 1.0 Universal</span>
              </div>
            </div>

            <a
              href="/api/download?dropId=v-02"
              className="w-full py-3.5 bg-paper text-monitor text-center font-bold text-sm rounded hover:bg-white transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download LUT Suite (.zip)
            </a>
            <span className="text-[11px] text-paper-muted text-center">
              Verified package with SHA-256 integrity check.
            </span>
          </div>
        </div>
      </div>

      <TimelineBar />
    </div>
  );
}
