'use client';
import { useState, useEffect } from 'react';

/**
 * Shared high-precision SMPTE 30 FPS timecode hook.
 * Formats timecode as HH:MM:SS:FF.
 */
export function useSmpteTimecode(baseHours = 0, baseMinutes = 0, baseSeconds = 14, initialFrame = 21) {
  const [timecode, setTimecode] = useState(() => {
    const hh = String(baseHours).padStart(2, '0');
    const mm = String(baseMinutes).padStart(2, '0');
    const ss = String(baseSeconds).padStart(2, '0');
    const ff = String(initialFrame).padStart(2, '0');
    return `${hh}:${mm}:${ss}:${ff}`;
  });

  useEffect(() => {
    let totalFrames =
      baseHours * 3600 * 30 +
      baseMinutes * 60 * 30 +
      baseSeconds * 30 +
      initialFrame;

    const interval = setInterval(() => {
      totalFrames += 1;
      const ff = totalFrames % 30;
      const totalSec = Math.floor(totalFrames / 30);
      const ss = totalSec % 60;
      const totalMin = Math.floor(totalSec / 60);
      const mm = totalMin % 60;
      const hh = Math.floor(totalMin / 60) % 24;

      const hhStr = String(hh).padStart(2, '0');
      const mmStr = String(mm).padStart(2, '0');
      const ssStr = String(ss).padStart(2, '0');
      const ffStr = String(ff).padStart(2, '0');
      setTimecode(`${hhStr}:${mmStr}:${ssStr}:${ffStr}`);
    }, 33.33);

    return () => clearInterval(interval);
  }, [baseHours, baseMinutes, baseSeconds, initialFrame]);

  return timecode;
}
