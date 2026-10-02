'use client';
import { useState, useEffect, useRef } from 'react';

interface TypewriterQuoteProps {
  quote: string;
  name: string;
  role: string;
}

export function TypewriterQuote({ quote, name, role }: TypewriterQuoteProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    const fallbackTimer = setTimeout(() => setHasStarted(true), 1000);
    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= quote.length) {
        setDisplayedText(quote.slice(0, currentIndex));
        currentIndex++;
      } else {
        setIsTypingDone(true);
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [hasStarted, quote]);

  return (
    <div
      ref={containerRef}
      className="p-6 space-y-4 border border-[#1F1F24] bg-[#0E0E11]"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1F1F24]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#FFFFFF]" />
          <span className="font-mono text-[8px] font-black text-[#A1A1AA] uppercase tracking-[0.2em]">
            STATEMENT // {name.replace(/[^a-zA-Z]/g, '').toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-wider text-[#FFFFFF] font-bold">
          <span className="w-1.5 h-1.5 bg-[#FF4400]" />
          <span>VERIFIED</span>
        </div>
      </div>

      {/* QUOTE TEXT */}
      <blockquote className="font-mono text-xs sm:text-sm text-[#FFFFFF] leading-relaxed min-h-[4.5rem] select-none">
        &ldquo;{displayedText}&rdquo;
        <span className="inline-block text-[#FFFFFF] font-bold font-mono ml-0.5 animate-pulse text-base align-middle">
          _
        </span>
      </blockquote>

      {/* FOOTER METADATA */}
      <div className="pt-3 border-t border-[#1F1F24] flex items-center justify-between font-mono text-[9px]">
        <span className="font-black text-[#FFFFFF] uppercase tracking-wider">{name}</span>
        <span className="text-[#A1A1AA] uppercase tracking-widest">{role}</span>
      </div>
    </div>
  );
}
