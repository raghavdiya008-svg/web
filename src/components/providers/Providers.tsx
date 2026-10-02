'use client';
import { SessionProvider } from './SessionProvider';
import { ThemeProvider } from './ThemeProvider';
import { SmoothScroll } from './SmoothScroll';
import { PageTransition } from '@/components/motion/PageTransition';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <SmoothScroll>
          <PageTransition>
            {children}
          </PageTransition>
        </SmoothScroll>
      </ThemeProvider>
    </SessionProvider>
  );
}