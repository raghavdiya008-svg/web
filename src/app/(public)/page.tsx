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
    'Curated SFX packs, 35mm film grains, color-science LUTs, and motion geometry packs — 100% free for 3D artists, video editors, and animators. New drops daily at 14:00 UTC.',
  openGraph: {
    title: 'EditX Vault — Precision Creative Asset Repository',
    description:
      'Curated SFX packs, 35mm film grains, color-science LUTs, and motion geometry packs — free for video editors and 3D artists.',
    type: 'website',
    siteName: 'EditX Vault',
  },
};

const MARQUEE_CATEGORIES = [
  'ANALOG SFX',
  '35MM FILM GRAIN',
  'COLOR-SCIENCE LUTS',
  'LOTTIE KINETICS',
  'MOTION OVERLAYS',
  '4K PRORES ASSETS',
  'TYPOGRAPHY PACKS',
  'VECTOR SVG SETS',
  'BLENDER 3D SHADERS',
  'AUDIO STEMS',
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
  let totalUsers = 2480;

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
      totalUsers = usersCountRes.count ?? 2480;
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
    <div className="min-h-screen bg-background text-text-primary transition-colors duration-200">
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
          <div className="flex items-baseline justify-between mb-8 pb-3 border-b border-[#1F1F24]">
            <div>
              <span className="font-mono text-[9px] tracking-[0.24em] text-[#A1A1AA] uppercase block mb-1">
                EXHIBIT 01 // ACTIVE DROP
              </span>
              <h2 className="font-display font-black text-3xl md:text-4xl text-[#FFFFFF] uppercase tracking-[-0.03em]">
                TODAY'S DROP
              </h2>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#FFFFFF] uppercase tracking-widest font-bold">
              <span className="w-1.5 h-1.5 bg-[#00FF41] animate-pulse" />
              AVAILABLE NOW
            </div>
          </div>
        </MotionFade>

        {liveDrop ? (
          <MotionFade delay={0.1}>
            <FeaturedDrop drop={liveDrop} session={session} />
          </MotionFade>
        ) : (
          <div className="p-12 text-center border border-[#1F1F24] bg-[#0E0E11]">
            <p className="font-mono text-xs text-[#A1A1AA] uppercase tracking-wider">
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
            <div className="flex items-baseline justify-between mb-8 pb-3 border-b border-[#1F1F24]">
              <div>
                <span className="font-mono text-[9px] tracking-[0.24em] text-[#A1A1AA] uppercase block mb-1">
                  EXHIBIT 02 // SCHEDULED ARCHIVE
                </span>
                <h2 className="font-display font-black text-3xl md:text-4xl text-[#FFFFFF] uppercase tracking-[-0.03em]">
                  NEXT IN QUEUE
                </h2>
              </div>
              <span className="font-mono text-[10px] text-[#A1A1AA] uppercase tracking-wider">
                14:00 UTC DAILY RELEASE
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
          <div className="flex items-baseline justify-between mb-8 pb-3 border-b border-[#1F1F24]">
            <div>
              <span className="font-mono text-[9px] tracking-[0.24em] text-[#A1A1AA] uppercase block mb-1">
                EXHIBIT 03 // INTERACTIVE TEST BENCH
              </span>
              <h2 className="font-display font-black text-3xl md:text-4xl text-[#FFFFFF] uppercase tracking-[-0.03em]">
                LIVE ASSET ENGINES
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-2 font-mono text-[9px] text-[#A1A1AA] uppercase tracking-wider">
              <span className="w-1.5 h-1.5 bg-[#FFFFFF]" />
              <span>INTERACTIVE SANDBOX</span>
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
          <div className="flex items-baseline justify-between mb-8 pb-3 border-b border-[#1F1F24]">
            <div>
              <span className="font-mono text-[9px] tracking-[0.24em] text-[#A1A1AA] uppercase block mb-1">
                EXHIBIT 04 // PERMANENT INDEX
              </span>
              <h2 className="font-display font-black text-3xl md:text-4xl text-[#FFFFFF] uppercase tracking-[-0.03em]">
                PAST DROPS
              </h2>
            </div>
            <Link
              href="/vault"
              className="text-xs font-mono font-bold text-[#FFFFFF] hover:text-[#A1A1AA] transition-colors tracking-wider uppercase flex items-center gap-1.5"
            >
              FULL ARCHIVE
              <ArrowRight size={13} />
            </Link>
          </div>
        </MotionFade>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pastDrops.map((drop) => (
            <StaggerItem key={drop.id}>
              <DropCard drop={drop} session={session} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>


    </div>
  );
}
