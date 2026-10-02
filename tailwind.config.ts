import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#070708',
        surface: '#0E0E10',
        'surface-elevated': '#141417',
        'surface-panel': '#111114',
        border: '#1F1F24',
        'border-subtle': '#16161A',
        'border-hover': '#4A4A52',
        'text-primary': '#FFFFFF',
        'text-secondary': '#A1A1AA',
        'text-muted': '#71717A',
        accent: {
          DEFAULT: '#FFFFFF',
          glow: 'rgba(255, 255, 255, 0.25)',
        },
        orange: {
          DEFAULT: '#FF4400',
          dim: '#B33000',
          glow: 'rgba(255, 68, 0, 0.3)',
        },
        amber: {
          DEFAULT: '#FF4400',
          dim: '#B33000',
          glow: 'rgba(255, 68, 0, 0.3)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(3.5rem, 8.5vw, 7.5rem)', { lineHeight: '0.92', letterSpacing: '-0.045em', fontWeight: '900' }],
        'display-lg': ['clamp(2.5rem, 5.5vw, 4.5rem)', { lineHeight: '0.96', letterSpacing: '-0.035em', fontWeight: '800' }],
        'display-md': ['clamp(1.75rem, 3.5vw, 2.75rem)', { lineHeight: '1.05', letterSpacing: '-0.025em', fontWeight: '800' }],
        'display-sm': ['clamp(1.25rem, 2vw, 1.85rem)', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        body: ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        caption: ['0.75rem', { lineHeight: '1.4', fontWeight: '500', letterSpacing: '0.12em' }],
      },
      borderRadius: {
        none: '0',
        DEFAULT: '0px',
        sm: '0px',
        md: '0px',
        lg: '1px',
      },
      boxShadow: {
        'hardware-bevel': 'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.6)',
        'hardware-inset': 'inset 0 2px 4px rgba(0,0,0,0.8), inset 0 0 2px rgba(0,0,0,0.6)',
        'led-green': '0 0 10px #00FF41, 0 0 20px rgba(0,255,65,0.4)',
        'led-amber': '0 0 10px #FFB000, 0 0 20px rgba(255,176,0,0.4)',
        'led-red': '0 0 10px #FF3333, 0 0 20px rgba(255,51,51,0.4)',
      },
    },
  },
  plugins: [],
};

export default config;