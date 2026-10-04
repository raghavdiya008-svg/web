'use client';
import { SessionProvider } from './SessionProvider';
import { SmoothScroll } from './SmoothScroll';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SmoothScroll>
        {children}
      </SmoothScroll>
    </SessionProvider>
  );
}