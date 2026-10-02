'use client';
import { useState, useEffect } from 'react';
import { Lock, ShieldAlert } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';
import { cn } from '@/lib/utils/cn';
import { playStaticBurst } from '@/lib/audio/soundFx';

interface LockedTeaserProps {
  drop: {
    id: string;
    title: string;
    scheduled_for: string;
    categories?: {
      slug?: string;
      name?: string;
      color?: string;
    };
  };
}

const GLYPHS = '0123456789ABCDEF$#@!%&*<>?~/\\';

function useScrambleText(targetText: string, trigger: boolean) {
  const [displayText, setDisplayText] = useState(targetText);

  useEffect(() => {
    let iteration = 0;
    const maxIterations = targetText.length;
    let interval: NodeJS.Timeout;

    if (trigger) {
      interval = setInterval(() => {
        setDisplayText(
          targetText
            .split('')
            .map((char, index) => {
              if (index < iteration) {
                return char;
              }
              if (char === ' ') return ' ';
              return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            })
            .join('')
        );

        iteration += 1;
        if (iteration > maxIterations) {
          clearInterval(interval);
        }
      }, 40);
    } else {
      // Revert to encrypted scrambled state
      let step = 0;
      interval = setInterval(() => {
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
          clearInterval(interval);
          setDisplayText(targetText);
        }
      }, 50);
    }

    return () => clearInterval(interval);
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
      className="group relative metal-chassis canister-glass overflow-hidden transition-all duration-300 flex flex-col justify-between border border-[#1F1F24] hover:border-[#FFFFFF]"
    >
      {/* CANISTER TOP CHASSIS */}
      <div className="px-5 py-3 bg-[#141417] border-b border-[#1F1F24] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#FFFFFF]" />
          <span className="font-mono text-[9px] font-black text-[#FFFFFF] uppercase tracking-[0.2em]">
            SCHEDULED // {drop.id.slice(-4).toUpperCase()}
          </span>
        </div>

        {/* SEALED STAMP BADGE */}
        <div className="px-2 py-0.5 border border-[#27272A] bg-[#0E0E11] flex items-center gap-1.5">
          <Lock size={10} className="text-[#FFFFFF]" />
          <span className="font-mono text-[8px] font-black text-[#FFFFFF] uppercase tracking-wider">
            LOCKED
          </span>
        </div>
      </div>

      {/* SMOKED GLASS WORKSPACE */}
      <div className="relative p-6 space-y-6">
        {/* TOP STATUS BAR: CATEGORY & LOCK BADGE */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] font-black tracking-[0.16em] text-[#FFFFFF] uppercase px-2 py-0.5 border border-[#27272A] bg-[#16161A]">
            {categoryName}
          </span>

          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#1F1414] border border-[#FF3333]/40">
            <span className="w-1.5 h-1.5 bg-[#FF3333] animate-pulse" />
            <span className="font-mono text-[8px] font-black tracking-[0.18em] text-[#FF3333] uppercase">
              ENCRYPTED
            </span>
          </div>
        </div>

        {/* ASSET TITLE WITH TEXT SCRAMBLE ON HOVER */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ShieldAlert size={12} className={cn('transition-colors', isHovered ? 'text-[#FF9E1B]' : 'text-[#8A8A8E]')} />
            <span className="font-mono text-[8px] text-[#8A8A8E] uppercase tracking-[0.16em]">
              {isHovered ? 'DECRYPTING PAYLOAD HEADER...' : 'ENCRYPTED CIPHERTEXT'}
            </span>
          </div>
          <h3 className="font-display font-extrabold text-lg sm:text-xl text-[#F5F5F5] uppercase tracking-tight leading-snug line-clamp-2 min-h-[52px]">
            {scrambledTitle}
          </h3>
          <p className="font-mono text-[8px] text-[#525256] uppercase tracking-[0.14em]">
            AES-256-GCM SECURE HARDWARE ENCLAVE
          </p>
        </div>

        {/* CIRCULAR STOPWATCH COUNTDOWN DIAL WITH LED SEGMENT STYLING */}
        <div className="pt-2 border-t border-[#1E1E22]">
          <CountdownTimer targetDate={drop.scheduled_for} size="md" />
        </div>
      </div>

      {/* CANISTER BOTTOM BEZEL */}
      <div className="px-5 py-2.5 bg-[#141417] border-t border-[#1F1F24] flex items-center justify-between text-[8px] font-mono text-[#71717A]">
        <div className="flex items-center gap-1.5">
          <span className="w-1 h-1 bg-[#52525B]" />
          <span className="uppercase tracking-[0.16em]">SHA-256 SIGNED</span>
        </div>
        <span className="text-[#FFFFFF] uppercase tracking-[0.16em] font-bold">
          100% FREE
        </span>
      </div>
    </div>
  );
}