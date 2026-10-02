import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import '@/app/globals.css';
import { Providers } from '@/components/providers/Providers';
import { GrainOverlay } from '@/components/layout/GrainOverlay';

const inter = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'EditX Vault — Open Creative Hardware & Motion Assets',
  description:
    'Tactile audio stems, 35mm film grains, color-science LUTs, and motion geometry packs for creative professionals.',
};

export const viewport: Viewport = {
  themeColor: '#0A0A0C',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body
        suppressHydrationWarning
        className="bg-background text-text-primary antialiased selection:bg-accent/30 selection:text-white min-h-screen flex flex-col relative"
      >
        <GrainOverlay />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
