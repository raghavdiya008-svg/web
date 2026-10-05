'use client';
import { useState, useEffect } from 'react';

// Lightweight shared reactive state for studio audio monitoring
let globalAudioArmed = false;
const listeners = new Set<(armed: boolean) => void>();

export function setAudioArmedState(armed: boolean) {
  globalAudioArmed = armed;
  listeners.forEach((listener) => listener(armed));
}

export function useAudioArmed(): [boolean, (armed: boolean) => void] {
  const [armed, setArmed] = useState(globalAudioArmed);

  useEffect(() => {
    const handler = (newVal: boolean) => setArmed(newVal);
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  return [armed, setAudioArmedState];
}
