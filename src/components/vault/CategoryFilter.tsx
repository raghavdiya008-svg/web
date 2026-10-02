'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { playMechanicalClick } from '@/lib/audio/soundFx';

const CATEGORIES = [
  { slug: 'all', label: 'ALL STEMS' },
  { slug: 'sfx', label: 'ANALOG SFX' },
  { slug: 'luts', label: 'COLOR LUTS' },
  { slug: 'animations', label: '3D KINETICS' },
  { slug: 'overlays', label: 'FILM GRAIN & OVERLAYS' },
  { slug: 'contracts', label: 'LEGAL SPECS' },
  { slug: 'typography', label: 'TYPOGRAPHY' },
  { slug: 'icons', label: 'VECTOR PACKS' },
];

export function CategoryFilter({ activeCategory = 'all' }: { activeCategory?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSelect = (slug: string) => {
    playMechanicalClick();
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
    if (slug === 'all') {
      params.delete('category');
    } else {
      params.set('category', slug);
    }
    params.delete('page');
    router.push(`/vault?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#2A2A2C]">
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.slug;
        return (
          <button
            key={cat.slug}
            onClick={() => handleSelect(cat.slug)}
            aria-pressed={isActive}
            className={cn(
              'px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] whitespace-nowrap transition-all duration-150 border cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00FF41] active:translate-y-0.5',
              isActive
                ? 'bg-[#00FF41] border-[#00FF41] text-[#0A0A0C] font-extrabold shadow-[0_0_10px_rgba(0,255,65,0.3)]'
                : 'bg-[#111114] border-[#2A2A2C] text-[#8A8A8E] hover:text-[#F5F5F5] hover:border-[#3E3E44] hover:bg-[#18181D]'
            )}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}