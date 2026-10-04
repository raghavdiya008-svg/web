'use client';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface CountdownTimerProps {
  targetDate: string | Date;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}

function calcTimeLeft(target: number): TimeLeft {
  const diff = Math.max(0, target - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
    totalSeconds,
  };
}

export function CountdownTimer({ targetDate, className, size = 'md' }: CountdownTimerProps) {
  const target = new Date(targetDate).getTime();
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<TimeLeft>(calcTimeLeft(target));

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setTime(calcTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const pad = (n: number) => n.toString().padStart(2, '0');

  // Second hand angle for the stopwatch dial (0 to 360 degrees)
  const secondsAngle = ((time.seconds % 60) / 60) * 360;

  const isExpired = time.totalSeconds <= 0;

  if (isExpired) {
    return (
      <div className={cn('font-mono text-[#FF9E1B] flex items-center gap-2', className)}>
        <span className="led-amber animate-pulse" />
        <span className="text-[10px] tracking-widest uppercase font-bold">UNLOCKED / LIVE</span>
      </div>
    );
  }

  // Dial diameter sizing
  const dialSize = size === 'sm' ? 68 : size === 'lg' ? 110 : 84;
  const radius = dialSize / 2 - 6;
  const circumference = 2 * Math.PI * radius;
  // Progress stroke based on seconds
  const strokeDashoffset = circumference - ((time.seconds % 60) / 60) * circumference;

  return (
    <div className={cn('flex items-center gap-4', className)}>
      {/* CIRCULAR STOPWATCH DIAL (PHASE 4) */}
      <div
        className={cn(
          'relative shrink-0 flex items-center justify-center bg-[#060608] border border-[#222226] shadow-[inset_0_2px_6px_rgba(0,0,0,0.95)]',
          size === 'sm' ? 'w-[68px] h-[68px]' : size === 'lg' ? 'w-[110px] h-[110px]' : 'w-[84px] h-[84px]'
        )}
      >
        <svg
          width={dialSize}
          height={dialSize}
          viewBox={`0 0 ${dialSize} ${dialSize}`}
          className="absolute inset-0 -rotate-90 pointer-events-none"
        >
          {/* Dial Background Ring */}
          <circle
            cx={dialSize / 2}
            cy={dialSize / 2}
            r={radius}
            fill="none"
            stroke="#1A1A1E"
            strokeWidth="3"
          />

          {/* Calibrated Tick Marks around dial */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x1 = dialSize / 2 + (radius - 2) * Math.cos(angle);
            const y1 = dialSize / 2 + (radius - 2) * Math.sin(angle);
            const x2 = dialSize / 2 + (radius + 2) * Math.cos(angle);
            const y2 = dialSize / 2 + (radius + 2) * Math.sin(angle);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={i % 3 === 0 ? '#8A8A8E' : '#2A2A2E'}
                strokeWidth={i % 3 === 0 ? 1.5 : 1}
              />
            );
          })}

          {/* Dynamic Active Sweep Arc */}
          <circle
            cx={dialSize / 2}
            cy={dialSize / 2}
            r={radius}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="square"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        {/* ROTATING WHITE STOPWATCH HAND */}
        <div
          className="absolute w-full h-full pointer-events-none transition-transform duration-1000 ease-linear flex items-center justify-center"
          style={{ transform: `rotate(${secondsAngle}deg)` }}
        >
          <div
            className="w-[1px] bg-[#FFFFFF]"
            style={{ height: radius - 3, transform: `translateY(-${(radius - 3) / 2}px)` }}
          />
        </div>

        {/* DIAL CENTER PIN */}
        <div className="absolute w-1.5 h-1.5 rounded-full bg-[#FFFFFF] border border-[#000000] z-10" />
      </div>

      {/* DIGITAL READOUT */}
      <div className="space-y-1">
        <div className="font-mono text-[8px] tracking-[0.18em] text-[#A1A1AA] uppercase font-bold">
          RELEASE COUNTDOWN
        </div>
        <div className="font-mono text-base sm:text-lg font-black text-[#FFFFFF] tracking-wider tabular-nums flex items-center gap-1">
          <span className="px-2 py-0.5 bg-[#141417] border border-[#27272A]">
            {mounted ? pad(time.hours) : '--'}
            <span className="text-[8px] text-[#A1A1AA] ml-0.5 font-normal">H</span>
          </span>
          <span className="text-[#52525B]">:</span>
          <span className="px-2 py-0.5 bg-[#141417] border border-[#27272A]">
            {mounted ? pad(time.minutes) : '--'}
            <span className="text-[8px] text-[#A1A1AA] ml-0.5 font-normal">M</span>
          </span>
          <span className="text-[#52525B]">:</span>
          <span className="px-2 py-0.5 bg-[#141417] border border-[#27272A]">
            {mounted ? pad(time.seconds) : '--'}
            <span className="text-[8px] text-[#FF4400] ml-0.5 font-bold">S</span>
          </span>
        </div>
        <div className="font-mono text-[8px] text-[#71717A] tracking-[0.14em] uppercase">
          AUTOMATIC DROP // 14:00 UTC
        </div>
      </div>
    </div>
  );
}