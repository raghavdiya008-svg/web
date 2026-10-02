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
    let frame = initialFrame;
    const interval = setInterval(() => {
      frame = (frame + 1) % 30;
      const hh = String(baseHours).padStart(2, '0');
      const mm = String(baseMinutes).padStart(2, '0');
      const ss = String(baseSeconds).padStart(2, '0');
      const ff = String(frame).padStart(2, '0');
      setTimecode(`${hh}:${mm}:${ss}:${ff}`);
    }, 33.33);

    return () => clearInterval(interval);
  }, [baseHours, baseMinutes, baseSeconds, initialFrame]);

  return timecode;
}
