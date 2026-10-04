'use client';
import { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';
import { cn } from '@/lib/utils/cn';
import { playStaticBurst } from '@/lib/audio/soundFx';

interface LockedTeaserProps {
  drop: {
    id: string;
    title: string;
    scheduled_for: string;
    categories?: {
      name?: string;
    };
  };
}

const GLYPHS = '0123456789ABCDEF$#@!%&*<>?~/\\';

function useScrambleText(targetText: string, trigger: boolean) {
  const [displayText, setDisplayText] = useState(targetText);

  useEffect(() => {
    let isMounted = true;
    let iteration = 0;
    const maxIterations = targetText.length;
    let interval: NodeJS.Timeout | null = null;

    if (trigger) {
      interval = setInterval(() => {
        if (!isMounted) return;
        setDisplayText(
          targetText
            .split('')
            .map((char, index) => {
              if (index < iteration) return char;
              if (char === ' ') return ' ';
              return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            })
            .join('')
        );

        iteration += 1;
        if (iteration > maxIterations) {
          if (interval) clearInterval(interval);
        }
      }, 40);
    } else {
      let step = 0;
      interval = setInterval(() => {
        if (!isMounted) return;
        setDisplayText(
          targetText
            .split('')
            .map((char, i) => {
              if (char === ' ') return ' ';
              if (i % 2 === 0) return GLYPHS[(step + i) % GLYPHS.length];
              return char;
            })
            .join('')
        );
        step++;
        if (step > 4) {
          if (interval) clearInterval(interval);
          setDisplayText(targetText);
        }
      }, 50);
    }

    return () => {
      isMounted = false;
      if (interval) clearInterval(interval);
    };
  }, [targetText, trigger]);

  return displayText;
}

export function LockedTeaser({ drop }: LockedTeaserProps) {
  const [isHovered, setIsHovered] = useState(false);
  const scrambledTitle = useScrambleText(drop.title, isHovered);
  const categoryName = drop.categories?.name || 'ASSET';

  const handleMouseEnter = () => {
    setIsHovered(true);
    playStaticBurst();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative metal-chassis canister-glass overflow-hidden transition-all duration-300 flex flex-col justify-between border border-border hover:border-primary"
    >
      <div className="px-5 py-3 bg-surface-elevated border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[12px] font-black text-primary uppercase">
            {categoryName}
          </span>
        </div>

        <div className="px-2 py-0.5 border border-border bg-background flex items-center gap-1.5">
          <Lock size={12} className="text-primary" />
          <span className="font-mono text-[12px] font-black text-primary uppercase">
            LOCKED
          </span>
        </div>
      </div>

      <div className="relative p-6 space-y-6 flex-1 flex flex-col justify-between">
        <div className="space-y-2" title={drop.title}>
          <h3 className="font-display font-extrabold text-lg sm:text-xl text-primary capitalize tracking-normal leading-snug line-clamp-2 min-h-[56px] text-balance">
            {scrambledTitle}
          </h3>
          <p className="font-mono text-[12px] text-muted uppercase">
            Next Drop Schedule
          </p>
        </div>

        <div className="pt-4 border-t border-border">
          <CountdownTimer targetDate={drop.scheduled_for} size="md" />
        </div>
      </div>
    </div>
  );
}