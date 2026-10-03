import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        'surface-elevated': 'var(--color-surface-elevated)',
        'surface-panel': 'oklch(0.14 0.005 260)',
        border: 'var(--color-border)',
        'border-subtle': 'var(--color-border-subtle)',
        'border-hover': 'oklch(0.32 0.005 260)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        accent: {
          DEFAULT: 'var(--color-accent)',
          glow: 'rgba(255, 255, 255, 0.25)',
        },
        orange: {
          DEFAULT: 'var(--color-orange)',
          dim: 'oklch(0.55 0.20 38)',
          glow: 'oklch(0.68 0.22 38 / 0.3)',
        },
        amber: {
          DEFAULT: 'var(--color-amber)',
          dim: 'oklch(0.55 0.20 38)',
          glow: 'oklch(0.68 0.22 38 / 0.3)',
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