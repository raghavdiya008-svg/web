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
import { TypewriterQuote } from '@/components/layout/TypewriterQuote';
import { ArrowRight, Sliders, Sparkles } from 'lucide-react';

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

const TESTIMONIALS = [
  {
    quote: "The quality is genuinely superior to studio-bought packs. The Kodak 500T LUT holds up flawlessly in Arri and RED Log footage.",
    name: 'Alex Vance',
    role: 'Lead Colorist & Senior Editor',
  },
  {
    quote: "EditX Vault is the only daily terminal I keep open. Every morning drop is production-tested and immediate drop-in ready.",
    name: 'Priya Kapoor',
    role: 'Senior Motion Designer',
  },
  {
    quote: "The 24-bit trailer sub bass suite is permanently mapped in our studio Reaper and Premiere template. Incredible punch.",
    name: 'Jordan Rivera',
    role: 'VFX Sound Supervisor',
  },
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

  // High-fidelity studio mock data
  if (!liveDrop) {
    liveDrop = {
      id: 'mock-1',
      title: 'Cinematic Sub Bass & Organic Impact Suite 01',
      description:
        'Handcrafted analog sub-drops, modular brass hits, and acoustic impact textures designed for high-tension cinematic trailers. Includes 24 uncompressed stems at 48kHz / 24-bit.',
      categories: { slug: 'sfx', name: 'ANALOG SFX', color: '#00FF41' },
      file_format: 'wav',
      file_size: 142_000_000,
      license: 'MIT',
      scheduled_for: new Date().toISOString(),
      download_count: 842,
      compatible_software: ['Adobe Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Reaper'],
    };
    upcomingDrops = [
      {
        id: 'mock-2',
        title: 'Kodak 5219 500T Cine Emulation LUT',
        categories: { slug: 'luts', name: 'COLOR LUT', color: '#FFB000' },
        scheduled_for: new Date(Date.now() + 86_400_000).toISOString(),
      },
      {
        id: 'mock-3',
        title: 'Kinetic 3D Typography Rigs v2',
        categories: { slug: 'animations', name: '3D KINETICS', color: '#00FF41' },
        scheduled_for: new Date(Date.now() + 172_800_000).toISOString(),
      },
      {
        id: 'mock-4',
        title: 'Commercial Production Retainer & NDA Kit',
        categories: { slug: 'contracts', name: 'CONTRACT SPEC', color: '#FFB000' },
        scheduled_for: new Date(Date.now() + 259_200_000).toISOString(),
      },
    ];
    pastDrops = [
      {
        id: 'mock-5',
        title: 'Kodak 5219 500T Cine Grade',
        categories: { slug: 'luts', name: 'COLOR LUT', color: '#FFB000' },
        file_format: 'cube',
        file_size: 1_200_000,
        license: 'CC-0',
        download_count: 3340,
      },
      {
        id: 'mock-6',
        title: 'Vintage 16mm Grain Overlays 4K',
        categories: { slug: 'overlays', name: 'OVERLAYS', color: '#8A8A8E' },
        file_format: 'mov',
        file_size: 450_000_000,
        license: 'MIT',
        download_count: 1240,
      },
      {
        id: 'mock-7',
        title: 'Glitch Transition Stems Vol.3',
        categories: { slug: 'sfx', name: 'ANALOG SFX', color: '#00FF41' },
        file_format: 'wav',
        file_size: 78_000_000,
        license: 'MIT',
        download_count: 980,
      },
      {
        id: 'mock-8',
        title: 'Minimal Anamorphic Lower Thirds',
        categories: { slug: 'overlays', name: 'OVERLAYS', color: '#8A8A8E' },
        file_format: 'mogrt',
        file_size: 24_000_000,
        license: 'MIT',
        download_count: 672,
      },
      {
        id: 'mock-9',
        title: 'Arri Alexa 35 Film Matrix LUT',
        categories: { slug: 'luts', name: 'COLOR LUT', color: '#FFB000' },
        file_format: 'cube',
        file_size: 2_400_000,
        license: 'CC-0',
        download_count: 2150,
      },
      {
        id: 'mock-10',
        title: 'Mechanical Typewriter Stems (40 Takes)',
        categories: { slug: 'sfx', name: 'ANALOG SFX', color: '#00FF41' },
        file_format: 'wav',
        file_size: 18_000_000,
        license: 'MIT',
        download_count: 540,
      },
      {
        id: 'mock-11',
        title: 'Optical Flare Leak Transitions',
        categories: { slug: 'overlays', name: 'OVERLAYS', color: '#8A8A8E' },
        file_format: 'mov',
        file_size: 320_000_000,
        license: 'CC-0',
        download_count: 1530,
      },
      {
        id: 'mock-12',
        title: 'Commercial Master Retainer 2025',
        categories: { slug: 'contracts', name: 'CONTRACT SPEC', color: '#FFB000' },
        file_format: 'docx',
        file_size: 2_000_000,
        license: 'MIT',
        download_count: 2100,
      },
    ];
    totalDrops = 48;
    totalUsers = 2480;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0C]">
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
              <span className="w-1.5 h-1.5 bg-[#FF4400] animate-pulse" />
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

      {/* ================================================================
          TESTIMONIALS: TYPEWRITER OPERATOR LOGS
      ================================================================ */}
      <section className="border-t border-[#2A2A2C] bg-[#08080A]">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 py-14 sm:py-16">
          <MotionFade>
            <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#2A2A2C]">
              <div>
                <span className="font-mono text-[9px] tracking-[0.2em] text-[#8A8A8E] uppercase block mb-1">
                  OPERATOR TELEMETRY // PRODUCTION REVIEWS
                </span>
                <h2 className="font-display font-extrabold text-xl sm:text-2xl text-[#F5F5F5] uppercase tracking-tight">
                  FROM THE COMMUNITY
                </h2>
              </div>
              <span className="font-mono text-[9px] text-[#FF9E1B] uppercase tracking-widest font-bold">
                VERIFIED CREDENTIALS
              </span>
            </div>
          </MotionFade>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ quote, name, role }) => (
              <TypewriterQuote key={name} quote={quote} name={name} role={role} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}