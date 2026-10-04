import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // The Grading Suite 18% neutral grey room
        suite: '#5A5A5C',
        'suite-deep': '#4A4A4C',
        'suite-light': '#6B6B6E',
        // Monitor bezel & frame (only around media)
        monitor: '#0A0A0A',
        'monitor-bezel': '#161618',
        // High-contrast clean paper text
        paper: '#F2F1EE',
        'paper-dim': '#D0CFCB',
        'paper-muted': '#A4A39F',
        // Red playhead & record-arm only
        tally: '#E5322D',

        // Macbeth ColorChecker category swatches
        macbeth: {
          orange: '#D67E2C', // LUTs
          cyan: '#0885A1',   // Sound
          neutral: '#A0A0A0',// Grain & overlays
          blue: '#505BA6',   // Motion / Lottie
          yellow: '#E7C71F', // Typography
          foliage: '#576C43',// Contracts
        },

        // Backward compatibility mappings
        background: '#5A5A5C',
        surface: '#4A4A4C',
        'surface-elevated': '#3D3D3F',
        border: 'rgba(242, 241, 238, 0.12)',
        'border-subtle': 'rgba(242, 241, 238, 0.06)',
        'text-primary': '#F2F1EE',
        'text-secondary': '#D0CFCB',
        'text-muted': '#A4A39F',
        accent: '#E5322D',
      },
      fontFamily: {
        sans: ['var(--font-archivo)', 'system-ui', 'sans-serif'],
        display: ['var(--font-archivo)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-archivo)', 'monospace'], // tabular figures with Archivo
      },
      borderRadius: {
        none: '0',
        sm: '2px',
        DEFAULT: '4px',
        md: '6px',
        lg: '10px',
        monitor: '10px',
        clip: '3px',
      },
      boxShadow: {
        monitor: '0 20px 50px -10px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)',
        bezel: 'inset 0 1px 1px rgba(255,255,255,0.08), inset 0 -1px 2px rgba(0,0,0,0.8)',
      },
      transitionTimingFunction: {
        studio: 'cubic-bezier(0.2, 0, 0, 1)',
      },
    },
  },
  plugins: [],
};

export default config;