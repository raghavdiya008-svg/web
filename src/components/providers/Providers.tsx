'use client';
import { SessionProvider } from './SessionProvider';
import { ThemeProvider } from './ThemeProvider';
import { SmoothScroll } from './SmoothScroll';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </ThemeProvider>
    </SessionProvider>
  );
}