'use client';
import { cn } from '@/lib/utils/cn';

interface MarqueeProps {
  content: string[];
  speed?: number;
  className?: string;
}

export function Marquee({ content, speed = 30, className }: MarqueeProps) {
  const animationDuration = `${Math.round(content.length * (75 / speed))}s`;

  return (
    <div
      className={cn(
        'overflow-hidden w-full bg-[#0A0A0C] border-y border-[#1F1F24] py-3 relative',
        className
      )}
    >
      <div
        className="flex whitespace-nowrap will-change-transform py-0.5"
        style={{
          animation: `marquee ${animationDuration} linear infinite`,
        }}
      >
        {/* Two copies for seamless loop */}
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center shrink-0" aria-hidden={copy === 1}>
            {content.map((item, i) => (
              <span key={i} className="flex items-center">
                <span className="font-mono text-[9px] font-black tracking-[0.24em] text-[#A1A1AA] uppercase px-7 flex items-center gap-3">
                  <span className="text-[#FFFFFF]">/</span>
                  {item}
                </span>
                <span className="w-1 h-1 bg-[#27272A] shrink-0" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}