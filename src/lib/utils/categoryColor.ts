/**
 * Unified category token classes and safe badge styling
 * Maps category keys / colors to semantic Tailwind v4 classes without inline CSS.
 */

export interface CategoryStyle {
  border: string;
  text: string;
  bg: string;
  indicator: string;
}

export function getCategoryBadgeClasses(colorOrName?: string): string {
  const c = (colorOrName || '').toLowerCase();

  // SFX Packs / Cyan
  if (c.includes('sfx') || c.includes('06b6d4') || c.includes('cyan')) {
    return 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10';
  }
  // Color LUTs / Violet / Purple
  if (c.includes('lut') || c.includes('a78bfa') || c.includes('8b5cf6') || c.includes('purple')) {
    return 'border-violet-500/40 text-violet-400 bg-violet-500/10';
  }
  // Contracts / Amber / Orange / Yellow
  if (c.includes('contract') || c.includes('f59e0b') || c.includes('amber')) {
    return 'border-amber-500/40 text-amber-400 bg-amber-500/10';
  }
  // 3D Kinetics / Green
  if (c.includes('kinetic') || c.includes('10b981') || c.includes('emerald') || c.includes('green')) {
    return 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10';
  }
  // Film Overlays / Red / Rose
  if (c.includes('overlay') || c.includes('ef4444') || c.includes('red')) {
    return 'border-rose-500/40 text-rose-400 bg-rose-500/10';
  }
  // Typography / Pink
  if (c.includes('typo') || c.includes('ec4899') || c.includes('pink')) {
    return 'border-pink-500/40 text-pink-400 bg-pink-500/10';
  }

  // Default neutral badge
  return 'border-[#27272A] text-[#E4E4E7] bg-[#16161A]';
}

export function getCategoryIndicatorClass(colorOrName?: string): string {
  const c = (colorOrName || '').toLowerCase();
  if (c.includes('sfx') || c.includes('06b6d4') || c.includes('cyan')) return 'bg-cyan-400';
  if (c.includes('lut') || c.includes('a78bfa') || c.includes('8b5cf6') || c.includes('purple')) return 'bg-violet-400';
  if (c.includes('contract') || c.includes('f59e0b') || c.includes('amber')) return 'bg-amber-400';
  if (c.includes('kinetic') || c.includes('10b981') || c.includes('emerald') || c.includes('green')) return 'bg-emerald-400';
  if (c.includes('overlay') || c.includes('ef4444') || c.includes('red')) return 'bg-rose-400';
  if (c.includes('typo') || c.includes('ec4899') || c.includes('pink')) return 'bg-pink-400';
  return 'bg-[#A1A1AA]';
}
