import type { Metadata, Viewport } from 'next';
import { Inter, Inter_Tight, JetBrains_Mono } from 'next/font/google';
import '@/app/globals.css';
import { Providers } from '@/components/providers/Providers';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700', '800', '900'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://editxvault.vercel.app'),
  title: {
    default: 'EditX Vault — Open Creative Hardware & Motion Assets',
    template: '%s | EditX Vault',
  },
  description:
    'Curated analog SFX packs, 35mm film grains, color-science LUTs, and motion geometry packs — 100% free for 3D artists, video editors, and animators.',
  keywords: [
    'free sound effects',
    'cinematic sfx',
    '35mm film grain 4k',
    'lut pack',
    'color grading',
    'video editing assets',
    'motion design assets',
    'blender shaders',
    'lottie animations',
    'royalty free assets',
  ],
  authors: [{ name: 'EditX Vault Studio' }],
  creator: 'EditX Vault',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://editxvault.vercel.app',
    siteName: 'EditX Vault',
    title: 'EditX Vault — Open Creative Hardware & Motion Assets',
    description:
      'Curated analog SFX packs, 35mm film grains, color-science LUTs, and motion geometry packs for creative professionals.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EditX Vault — Open Creative Hardware & Motion Assets',
    description: 'Precision creative assets for video editors, animators, and 3D artists.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'EditX Vault',
    url: 'https://editxvault.vercel.app',
    description: 'Precision creative asset repository for 3D artists, animators, and video editors.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://editxvault.vercel.app/vault?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${inter.variable} ${interTight.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="bg-background text-text-primary antialiased selection:bg-accent/30 selection:text-white min-h-screen flex flex-col relative"
      >
        <Providers>
          {children}
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
