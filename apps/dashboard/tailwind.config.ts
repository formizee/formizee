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
            shine: 'shine var(--duration) infinite linear'
          },
          keyframes: {
            shine: {
              '0%': {
                'background-position': '0% 0%'
              },
              '50%': {
                'background-position': '100% 100%'
              },
              to: {
                'background-position': '0% 0%'
              }
            }
          }
        }
      },
      content: [
        './index.html',
        './src/**/*.{ts,tsx}',
        '../packages/ui/src/**/*{.js,.ts,.jsx,.tsx}'
      ]
    }
  ]
};

export default config;
