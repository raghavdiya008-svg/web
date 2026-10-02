import { Metadata } from 'next';
import Link from 'next/link';
import { auth } from '@/lib/auth/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { DropCard } from '@/components/vault/DropCard';
import { CategoryFilter } from '@/components/vault/CategoryFilter';

export const metadata: Metadata = {
  title: 'Vault Archive Reel — EditX Vault',
  description:
    'Browse 200+ precision creative assets: analog SFX packs, film LUTs, contracts, 3D kinetics, motion overlays. Search, filter, and extract instantly.',
};

const ITEMS_PER_PAGE = 24;

export default async function VaultPage(props: {
  searchParams: Promise<{ page?: string | string[]; category?: string | string[]; sort?: string | string[]; q?: string | string[] }>;
}) {
  const session = await auth();
  const resolvedParams = await props.searchParams;
  const rawPage = Array.isArray(resolvedParams.page) ? resolvedParams.page[0] : resolvedParams.page;
  const parsedPage = parseInt(rawPage ?? '1', 10);
  const page = isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;
  const category = Array.isArray(resolvedParams.category) ? resolvedParams.category[0] : resolvedParams.category;
  const rawSort = Array.isArray(resolvedParams.sort) ? resolvedParams.sort[0] : resolvedParams.sort;
  const sort = rawSort ?? 'newest';
  const query = Array.isArray(resolvedParams.q) ? resolvedParams.q[0] : resolvedParams.q;

  const supabase = createSupabaseServerClient();
  const isConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

  let drops: any[] = [];
  let count = 0;

  if (isConfigured) {
    try {
      let dbQuery = supabase
        .from('drops')
        .select(
          'id, title, category_id, scheduled_for, download_count, file_format, file_size, license, categories(slug, name, color)',
          { count: 'exact' }
        )
        .eq('is_live', true)
        .lt('scheduled_for', new Date().toISOString());

      if (category && category !== 'all') dbQuery = dbQuery.eq('categories.slug', category);
      if (query) dbQuery = dbQuery.ilike('title', `%${query}%`);

      switch (sort) {
        case 'oldest':
          dbQuery = dbQuery.order('scheduled_for', { ascending: true });
          break;
        case 'popular':
          dbQuery = dbQuery.order('download_count', { ascending: false });
          break;
        case 'size':
          dbQuery = dbQuery.order('file_size', { ascending: false });
          break;
        default:
          dbQuery = dbQuery.order('scheduled_for', { ascending: false });
      }

      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      dbQuery = dbQuery.range(from, to);

      const { data, count: dbCount } = await dbQuery;
      drops = data || [];
      count = dbCount || 0;
    } catch (err) {
      console.warn('Supabase query error on /vault', err);
    }
  }

  // Fallback demo assets for public preview
  if (!isConfigured || drops.length === 0) {
    const mockCatalog = [
      { id: 'v-1', title: 'Cinematic Sub Bass & Impact Suite 01', file_format: 'wav', file_size: 142000000, license: 'MIT', download_count: 842, categories: { slug: 'sfx', name: 'ANALOG SFX', color: '#00FF41' } },
      { id: 'v-2', title: 'Kodak 5219 500T Cine Emulation LUT', file_format: 'cube', file_size: 45000000, license: 'MIT', download_count: 1210, categories: { slug: 'luts', name: 'COLOR LUT', color: '#FFB000' } },
      { id: 'v-3', title: 'Kinetic 3D Typography Rigs v2', file_format: 'jsx', file_size: 12000000, license: 'MIT', download_count: 670, categories: { slug: 'animations', name: '3D KINETICS', color: '#00FF41' } },
      { id: 'v-4', title: 'Commercial Production Retainer & NDA Kit', file_format: 'docx', file_size: 2500000, license: 'MIT', download_count: 940, categories: { slug: 'contracts', name: 'CONTRACT SPEC', color: '#FFB000' } },
      { id: 'v-5', title: '16mm Grain Overlays 4K ProRes', file_format: 'mp4', file_size: 450000000, license: 'MIT', download_count: 1540, categories: { slug: 'overlays', name: 'OVERLAYS', color: '#8A8A8E' } },
      { id: 'v-6', title: 'Glitch Transition Stems & Risers', file_format: 'wav', file_size: 78000000, license: 'MIT', download_count: 810, categories: { slug: 'sfx', name: 'ANALOG SFX', color: '#00FF41' } },
      { id: 'v-7', title: 'Minimal Anamorphic Lower Thirds MOGRT', file_format: 'mogrt', file_size: 24000000, license: 'MIT', download_count: 672, categories: { slug: 'overlays', name: 'OVERLAYS', color: '#8A8A8E' } },
      { id: 'v-8', title: 'Vintage Anamorphic Lens Flare Mattes', file_format: 'mov', file_size: 320000000, license: 'CC0', download_count: 1830, categories: { slug: 'overlays', name: 'OVERLAYS', color: '#8A8A8E' } },
      { id: 'v-9', title: 'High-Retention Video Hook Sequences', file_format: 'pdf', file_size: 1800000, license: 'MIT', download_count: 2210, categories: { slug: 'hooks', name: 'HOOKS', color: '#FFB000' } },
      { id: 'v-10', title: 'Modern Editorial Font Pairing Guide', file_format: 'zip', file_size: 16000000, license: 'OFL', download_count: 730, categories: { slug: 'typography', name: 'TYPOGRAPHY', color: '#8A8A8E' } },
      { id: 'v-11', title: 'Streamline UI Vector Icon Pack 250+', file_format: 'svg', file_size: 8500000, license: 'MIT', download_count: 920, categories: { slug: 'icons', name: 'ICONS', color: '#00FF41' } },
      { id: 'v-12', title: 'Arri Alexa 35 Film Matrix LUT', file_format: 'cube', file_size: 38000000, license: 'MIT', download_count: 1390, categories: { slug: 'luts', name: 'COLOR LUT', color: '#FFB000' } },
    ];

    drops = mockCatalog.filter((d) => {
      if (category && category !== 'all' && d.categories.slug !== category) return false;
      if (query && !d.title.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
    count = drops.length;
  }

  return (
    <div className="max-w-[1280px] mx-auto px-5 lg:px-8 py-12 space-y-10 bg-[#0A0A0C]">
      {/* PAGE HEADER */}
      <div className="pb-8 border-b border-[#2A2A2C]">
        <div className="flex items-center gap-2 mb-2 font-mono text-[9px] tracking-[0.2em] text-[#8A8A8E] uppercase">
          <span className="led-green animate-pulse" />
          <span>MASTER ARCHIVE REEL // INDEXED ASSETS</span>
        </div>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl text-[#F5F5F5] uppercase tracking-tight">
              VAULT ARCHIVE
            </h1>
            <p className="text-[#8A8A8E] mt-2 max-w-xl text-xs sm:text-sm leading-relaxed">
              Every production drop indexed, scrubbable, and instantly downloadable. 100% free under open licenses.
            </p>
          </div>
          <div className="p-3 bg-[#060608] border border-[#2A2A2C] shadow-hardware-inset text-right shrink-0">
            <div className="font-mono text-xl sm:text-2xl text-[#F5F5F5] font-bold tabular-nums">
              {count}+
            </div>
            <div className="font-mono text-[8px] text-[#00FF41] uppercase tracking-widest mt-0.5">
              INDEXED STEMS
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORY FILTER */}
      <div>
        <CategoryFilter activeCategory={category || 'all'} />
      </div>

      {/* ASSET GRID */}
      {drops.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {drops.map((drop) => (
            <DropCard key={drop.id} drop={drop} session={session} />
          ))}
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center text-center border border-[#2A2A2C] bg-[#111114]">
          <p className="font-mono text-xs text-[#8A8A8E] uppercase tracking-wider mb-4">
            NO ASSETS MATCH CURRENT SPEC FILTER
          </p>
          <Link
            href="/vault"
            className="font-mono text-xs font-bold text-[#00FF41] hover:text-[#F5F5F5] transition-colors tracking-wider uppercase"
          >
            RESET ALL FILTERS →
          </Link>
        </div>
      )}
    </div>
  );
}