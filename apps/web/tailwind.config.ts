import sharedConfig from '@formizee/tailwind';
import type {Config} from 'tailwindcss';

const config: Pick<Config, 'presets'> = {
  presets: [
    {
      ...sharedConfig,
      theme: {
        extend: {
          fontFamily: {
            secondary: 'var(--font-space-grotesk)'
          },
          animation: {
            'border-beam':
              'border-beam calc(var(--duration)*1s) infinite linear',
            'shiny-text': 'shiny-text 8s infinite',
            orbit: 'orbit calc(var(--duration)*1s) linear infinite'
          },
          keyframes: {
            'shiny-text': {
              '0%, 90%, 100%': {
                'background-position': 'calc(-100% - var(--shiny-width)) 0'
              },
              '30%, 60%': {
                'background-position': 'calc(100% + var(--shiny-width)) 0'
              }
            },
            'border-beam': {
              '100%': {
                'offset-distance': '100%'
              }
            },
            orbit: {
              '0%': {
                transform:
                  'rotate(0deg) translateY(calc(var(--radius) * 1px)) rotate(0deg)'
              },
              '100%': {
                transform:
                  'rotate(360deg) translateY(calc(var(--radius) * 1px)) rotate(-360deg)'
              }
            }
          }
        }
      },
      darkMode: ['class'],
      content: [
        './index.html',
        './src/**/*.{ts,tsx}',
        '../packages/ui/src/**/*{.js,.ts,.jsx,.tsx}'
      ]
    }
  ]
};

export default config;
