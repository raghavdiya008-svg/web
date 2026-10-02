import { Metadata } from 'next';
import Link from 'next/link';
import { auth } from '@/lib/auth/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { CountdownTimer } from '@/components/vault/CountdownTimer';
import { TodayDownloadSection } from '@/components/vault/TodayDownloadSection';
import { formatBytes } from '@/lib/utils/cn';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Today's Drop // Studio Feed — EditX Vault",
    description: "Download today's free creative asset from EditX Vault.",
    openGraph: {
      title: "Today's Drop // Studio Feed — EditX Vault",
      description: "Today's free creative asset from EditX Vault.",
      type: 'website',
      siteName: 'EditX Vault',
    },
  };
}

export default async function TodayPage() {
  const session = await auth();
  const supabase = createSupabaseServerClient();

  let liveDrop: any = null;
  let nextDrop: any = null;
  const isConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

  if (isConfigured) {
    try {
      const { data } = await supabase
        .from('drops')
        .select('*, categories(slug, name, color)')
        .eq('is_live', true)
        .lte('scheduled_for', new Date().toISOString())
        .order('scheduled_for', { ascending: false })
        .limit(1)
        .maybeSingle();
      liveDrop = data;

      const { data: next } = await supabase
        .from('drops')
        .select('id, title, scheduled_for, categories(slug, name, color)')
        .eq('is_live', false)
        .gt('scheduled_for', new Date().toISOString())
        .order('scheduled_for', { ascending: true })
        .limit(1)
        .maybeSingle();
      nextDrop = next;
    } catch (err) {
      console.warn('Supabase not reachable', err);
    }
  }

  if (!liveDrop) {
    liveDrop = {
      id: 'mock-today',
      title: 'Cinematic Sub Bass & Impact Suite 01',
      description:
        'Handcrafted analog sub-drops, brass hits, and organic impact textures designed for high-tension cinematic trailers. Includes 45 dry stems, 20 processed impacts, and metadata for fast DAW search.',
      instructions:
        '1. Unzip the downloaded archive.\n2. Import WAV files at 24-bit 48kHz directly into your timeline, DAW, or sampler.\n3. Route through your low-end bus or master chain for maximum punch.',
      categories: { slug: 'sfx', name: 'ANALOG SFX', color: '#00FF41' },
      file_format: 'wav',
      file_size: 142_000_000,
      license: 'MIT',
      compatible_software: [
        'Premiere Pro',
        'DaVinci Resolve',
        'After Effects',
        'Final Cut Pro',
        'Ableton Live',
        'Reaper',
      ],
      scheduled_for: new Date().toISOString(),
      download_count: 842,
    };
  }

  if (!nextDrop) {
    nextDrop = {
      id: 'mock-next',
      title: 'Kodak 5219 500T Cine Emulation LUT',
      categories: { slug: 'luts', name: 'COLOR LUT', color: '#FFB000' },
      scheduled_for: new Date(Date.now() + 86_400_000).toISOString(),
    };
  }

  const categoryName = liveDrop.categories?.name || 'ASSET';

  return (
    <div className="max-w-[1280px] mx-auto px-5 lg:px-8 py-12 bg-[#0A0A0C]">
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* MAIN COLUMN */}
        <div className="flex-1 space-y-10 w-full">
          {/* HEADER */}
          <div className="space-y-4 pb-8 border-b border-[#2A2A2C]">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-[9px] font-bold tracking-[0.14em] uppercase px-2 py-0.5 border border-[#00FF41]/40 text-[#00FF41] bg-[#00FF41]/10">
                {categoryName}
              </span>
              <span className="text-[#333338] font-mono text-[10px]">·</span>
              <span className="text-[#8A8A8E] font-mono text-[10px] uppercase font-semibold">
                {liveDrop.file_format?.toUpperCase()} · {formatBytes(liveDrop.file_size)}
              </span>
              <span className="text-[#333338] font-mono text-[10px]">·</span>
              <span className="font-mono text-[10px] text-[#00FF41]">
                {liveDrop.license} LICENSE
              </span>
              <span className="text-[#333338] font-mono text-[10px]">·</span>
              <span className="font-mono text-[10px] text-[#FFB000]">
                100% PUBLIC ASSET
              </span>
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#F5F5F5] uppercase tracking-tight leading-[1.05]">
              {liveDrop.title}
            </h1>

            <p className="text-sm sm:text-base text-[#8A8A8E] leading-relaxed max-w-2xl font-body">
              {liveDrop.description}
            </p>
          </div>

          {/* INTERACTIVE PREVIEW & DOWNLOAD INTERACTIVE CLIENT SECTION */}
          <TodayDownloadSection drop={liveDrop} />

          {/* DOCUMENTATION & COMPATIBILITY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-[#2A2A2C]">
            <div className="space-y-3">
              <h3 className="font-mono text-[10px] font-bold text-[#8A8A8E] uppercase tracking-[0.16em]">
                DEPLOYMENT INSTRUCTIONS
              </h3>
              <div className="bg-[#0C0C0F] border border-[#2A2A2C] p-5 text-sm text-[#8A8A8E] leading-relaxed whitespace-pre-line font-mono text-xs shadow-hardware-inset">
                {liveDrop.instructions || 'No specific instructions provided. Refer to the asset documentation.'}
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-mono text-[10px] font-bold text-[#8A8A8E] uppercase tracking-[0.16em]">
                  COMPATIBLE HOST NLE / DAW
                </h3>
                <div className="flex flex-wrap gap-2">
                  {liveDrop.compatible_software?.map((sw: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-[#111114] border border-[#2A2A2C] font-mono text-[10px] text-[#F5F5F5] uppercase font-bold"
                    >
                      {sw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-mono text-[10px] font-bold text-[#8A8A8E] uppercase tracking-[0.16em]">
                  LEGAL SPEC & LICENSE
                </h3>
                <div className="bg-[#0C0C0F] border border-[#2A2A2C] p-4 space-y-1.5 shadow-hardware-inset">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#00FF41] font-bold uppercase">
                      {liveDrop.license} LICENSE
                    </span>
                  </div>
                  <p className="text-xs text-[#8A8A8E] leading-relaxed font-body">
                    {getLicenseSummary(liveDrop.license)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <aside className="w-full lg:w-80 shrink-0 space-y-6">
          {/* NEXT DROP CARD */}
          {nextDrop && (
            <div className="metal-chassis p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#2A2A2C]">
                <span className="font-mono text-[9px] font-bold text-[#8A8A8E] uppercase tracking-[0.16em]">
                  NEXT IN QUEUE
                </span>
                <span className="led-amber animate-pulse" />
              </div>
              <div>
                <CountdownTimer targetDate={nextDrop.scheduled_for} size="sm" className="mb-4" />
                <div className="text-[#F5F5F5] font-display font-bold text-sm uppercase leading-snug">
                  {nextDrop.title}
                </div>
                <div className="font-mono text-[9px] text-[#8A8A8E] uppercase tracking-wider mt-2">
                  UNLOCKS{' '}
                  {new Date(nextDrop.scheduled_for).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}{' '}
                  @ 14:00 UTC
                </div>
              </div>
            </div>
          )}

          {/* QUICK LINKS */}
          <div className="metal-chassis p-5 space-y-3">
            <span className="font-mono text-[9px] font-bold text-[#8A8A8E] uppercase tracking-[0.16em] block pb-2 border-b border-[#2A2A2C]">
              TERMINAL ROUTING
            </span>
            <div className="flex flex-col gap-2 font-mono text-xs">
              <Link href="/vault" className="text-[#8A8A8E] hover:text-[#00FF41] transition-colors uppercase">
                ← BROWSE FULL VAULT (200+ ASSETS)
              </Link>
              <Link href="/submit" className="text-[#8A8A8E] hover:text-[#00FF41] transition-colors uppercase">
                + SUBMIT PRODUCTION ASSET
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function getLicenseSummary(license: string): string {
  const summaries: Record<string, string> = {
    MIT: 'Permissive open-source license. Commercial use, modification, and distribution permitted.',
    'Apache-2.0': 'Permissive license with patent grant. Commercial use allowed with attribution.',
    CC0: 'Public domain dedication. Zero copyright restrictions. Free for any use.',
    'CC-BY-4.0': 'Attribution required. Commercial and non-commercial adaptation permitted.',
    OFL: 'SIL Open Font License. Free for print and digital design. Cannot be sold alone.',
    'EditX-Community': 'Free for all video, audio, and motion projects. Redistribution prohibited.',
  };
  return summaries[license] ?? 'Standard open asset license terms apply.';
}