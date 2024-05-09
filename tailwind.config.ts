import {fontFamily} from 'tailwindcss/defaultTheme';
import type {Config} from 'tailwindcss';
import {transform} from 'next/dist/build/swc';

const config = {
  darkMode: ['class'],
  content: [
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans]
      },
      keyframes: {
        'accordion-down': {
          from: {height: '0'},
          to: {height: 'var(--radix-accordion-content-height)'}
        },
        'accordion-up': {
          from: {height: 'var(--radix-accordion-content-height)'},
          to: {height: '0'}
        },
        'fade-in': {
          '0%': {opacity: '0', transform: 'translateY(10px)'},
          '100%': {opacity: '1', transform: 'translateY(0px)'}
        },
        spotlight: {
          from: {
            opacity: '0',
            transform: 'translate(-72%, -62%) scale(0.7)'
          },
          to: {
            opacity: '100',
            transform: 'translate(-50%,-40%) scale(1)'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 400ms ease-out forwards',
        spotlight: 'spotlight 1.5s ease-out forwards'
      }
    }
  }
} satisfies Config;

export default config;
