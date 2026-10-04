import { Metadata } from 'next';
import Link from 'next/link';
import { auth } from '@/lib/auth/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Marquee } from '@/components/layout/Marquee';
import { FeaturedDrop } from '@/components/vault/FeaturedDrop';
import { LockedTeaser } from '@/components/vault/LockedTeaser';
import { DropCard } from '@/components/vault/DropCard';
import { HeroSection } from '@/components/vault/HeroSection';
import { LutSlider } from '@/components/vault/AssetPreview/LutSlider';
import { LottiePreview } from '@/components/vault/AssetPreview/LottiePreview';
import { MotionFade, StaggerContainer, StaggerItem } from '@/components/motion/MotionFade';
import { ArrowRight, Sliders, Sparkles } from 'lucide-react';
import { EDITX_VAULT_CATALOG } from '@/data/vault_catalog';

export const metadata: Metadata = {
  title: 'EditX Vault — Precision Creative Asset Repository',
  description:
    'Curated 35mm film grains, color-science LUTs, typography suites, and motion geometry packs — 100% free for video editors and animators. New drops daily at 14:00 UTC.',
  openGraph: {
    title: 'EditX Vault — Precision Creative Asset Repository',
    description:
      'Curated 35mm film grains, color-science LUTs, typography suites, and motion geometry packs — free for video editors and animators.',
    type: 'website',
    siteName: 'EditX Vault',
  },
};

const MARQUEE_CATEGORIES = [
  '35MM FILM GRAIN',
  'COLOR-SCIENCE LUTS',
  'LOTTIE KINETICS',
  'MOTION OVERLAYS',
  '4K PRORES ASSETS',
  'TYPOGRAPHY PACKS',
  'VECTOR SVG SETS',
  'BLENDER 3D SHADERS',
  'ANAMORPHIC MATTES',
  'PRODUCTION CONTRACTS',
];



export default async function HomePage() {
  const session = await auth();

  const supabase = createSupabaseServerClient();
  const isConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

  let liveDrop: any = null;
  let upcomingDrops: any[] = [];
  let pastDrops: any[] = [];
  let totalDrops = 0;
  let totalUsers = 0;

  if (isConfigured) {
    try {
      const [liveRes, upcomingRes, pastRes, dropsCountRes, usersCountRes] = await Promise.all([
        supabase
          .from('drops')
          .select('*, categories(slug, name, color)')
          .eq('is_live', true)
          .lte('scheduled_for', new Date().toISOString())
          .order('scheduled_for', { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from('drops')
          .select('id, title, category_id, scheduled_for, categories(slug, name, color)')
          .eq('is_live', false)
          .gt('scheduled_for', new Date().toISOString())
          .order('scheduled_for', { ascending: true })
          .limit(3),
        supabase
          .from('drops')
          .select(
            'id, title, category_id, scheduled_for, download_count, file_format, file_size, license, categories(slug, name, color)'
          )
          .eq('is_live', true)
          .lt('scheduled_for', new Date().toISOString())
          .order('scheduled_for', { ascending: false })
          .limit(12),
        supabase.from('drops').select('*', { count: 'exact', head: true }).eq('is_live', true),
        supabase.from('users').select('*', { count: 'exact', head: true }),
      ]);

      liveDrop = liveRes.data;
      upcomingDrops = upcomingRes.data || [];
      pastDrops = pastRes.data || [];
      totalDrops = dropsCountRes.count ?? 0;
      totalUsers = usersCountRes.count ?? 0;
    } catch (err) {
      console.warn('Supabase unavailable — using fallback mock data', err);
    }
  }

  // Use verified local catalog if DB fails
  if (!liveDrop) {
    liveDrop = EDITX_VAULT_CATALOG.find(d => d.is_live && new Date(d.scheduled_for) <= new Date()) || EDITX_VAULT_CATALOG[0];
    
    upcomingDrops = EDITX_VAULT_CATALOG
      .filter(d => !d.is_live && new Date(d.scheduled_for) > new Date())
      .sort((a, b) => new Date(a.scheduled_for).getTime() - new Date(b.scheduled_for).getTime())
      .slice(0, 3);
      
    pastDrops = EDITX_VAULT_CATALOG
      .filter(d => d.is_live && d.id !== liveDrop.id)
      .sort((a, b) => new Date(b.scheduled_for).getTime() - new Date(a.scheduled_for).getTime())
      .slice(0, 12);
      
    totalDrops = EDITX_VAULT_CATALOG.length;
    totalUsers = 0; // Removing fake user counts
  }

  return (
    <div className="w-full bg-background text-text-primary transition-colors duration-200">
      {/* ================================================================
          HERO: THE COMMAND CENTER
      ================================================================ */}
      <HeroSection totalUsers={totalUsers} totalDrops={totalDrops} />

      {/* MARQUEE: 35MM FILM SPROCKET RUNNER */}
      <Marquee content={MARQUEE_CATEGORIES} speed={28} />

      {/* ================================================================
          TODAY'S DROP: ASSET DETAIL & MASTER TRANSPORT
      ================================================================ */}
      <section className="max-w-[1280px] mx-auto px-5 lg:px-8 pt-12 pb-10">
        <MotionFade>
          <div className="flex items-baseline justify-between mb-8 pb-3 border-b border-border">
            <div>
              <span className="font-mono text-[12px] tracking-widest text-accent uppercase block mb-1 font-bold">
                Daily Master Release
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-primary tracking-tight">
                Today&apos;s Feature Drop
              </h2>
            </div>
            <div className="flex items-center gap-2 text-[12px] font-mono text-accent uppercase tracking-wider font-bold">
              <span className="w-1.5 h-1.5 bg-green-500 animate-pulse rounded-full" />
              Live Download
            </div>
          </div>
        </MotionFade>

        {liveDrop ? (
          <MotionFade delay={0.1}>
            <FeaturedDrop drop={liveDrop} session={session} />
          </MotionFade>
        ) : (
          <div className="p-12 text-center border border-border bg-surface-elevated">
            <p className="font-mono text-[12px] text-muted uppercase tracking-wider">
              NO ASSET CURRENTLY MOUNTED. STANDBY FOR 14:00 UTC DROP CYCLE.
            </p>
          </div>
        )}
      </section>

      {/* ================================================================
          NEXT IN QUEUE: SEALED CANISTERS
      ================================================================ */}
      {upcomingDrops.length > 0 && (
        <section className="max-w-[1280px] mx-auto px-5 lg:px-8 py-10">
          <MotionFade>
            <div className="flex items-baseline justify-between mb-8 pb-3 border-b border-border">
              <div>
                <span className="font-mono text-[12px] tracking-widest text-muted uppercase block mb-1 font-bold">
                  Upcoming Pipeline
                </span>
                <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-primary tracking-tight">
                  Next in Queue
                </h2>
              </div>
              <span className="font-mono text-[12px] text-muted uppercase tracking-wider">
                14:00 UTC Releases
              </span>
            </div>
          </MotionFade>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingDrops.map((drop) => (
              <StaggerItem key={drop.id}>
                <LockedTeaser drop={drop} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      )}

      {/* ================================================================
          LIVE ASSET INSTRUMENTS: HARDWARE TESTING BENCH (LIVE DEMOS)
      ================================================================ */}
      <section className="max-w-[1280px] mx-auto px-5 lg:px-8 py-10">
        <MotionFade>
          <div className="flex items-baseline justify-between mb-8 pb-3 border-b border-border">
            <div>
              <span className="font-mono text-[12px] tracking-widest text-muted uppercase block mb-1 font-bold">
                Interactive Studio
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-primary tracking-tight">
                Live Asset Engines
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-2 font-mono text-[12px] text-muted uppercase tracking-wider">
              <span className="w-1.5 h-1.5 bg-primary" />
              <span>Real-time Sandbox</span>
            </div>
          </div>
        </MotionFade>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LUT COLOR SCIENCE DEMO (7 COLS) */}
          <div className="lg:col-span-7">
            <MotionFade delay={0.1}>
              <LutSlider />
            </MotionFade>
          </div>

          {/* LOTTIE KINETIC VECTOR DEMO (5 COLS) */}
          <div className="lg:col-span-5">
            <MotionFade delay={0.2}>
              <LottiePreview />
            </MotionFade>
          </div>
        </div>
      </section>

      {/* ================================================================
          PAST DROPS: THE ARCHIVE GRID
      ================================================================ */}
      <section className="max-w-[1280px] mx-auto px-5 lg:px-8 py-10">
        <MotionFade>
          <div className="flex items-baseline justify-between mb-8 pb-3 border-b border-border">
            <div>
              <span className="font-mono text-[12px] tracking-widest text-muted uppercase block mb-1 font-bold">
                Permanent Index
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-primary tracking-tight">
                Vault Archive
              </h2>
            </div>
            <Link
              href="/vault"
              className="text-[12px] font-mono font-bold text-primary hover:text-muted transition-colors tracking-wider uppercase flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              Full Archive
              <ArrowRight size={13} />
            </Link>
          </div>
        </MotionFade>

        <StaggerContainer className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5">
          {pastDrops.map((drop) => (
            <StaggerItem key={drop.id} className="h-full">
              <DropCard drop={drop} session={session} />
            </StaggerItem>
          ))}
          <StaggerItem className="h-full">
            <div className="h-full min-h-[300px] border border-dashed border-border flex items-center justify-center p-6 text-center text-muted font-mono text-[12px] uppercase tracking-wider bg-surface/50">
              More drops coming soon
            </div>
          </StaggerItem>
        </StaggerContainer>
      </section>


    </div>
  );
}
