import sharedConfig from '@formizee/tailwind';
import type {Config} from 'tailwindcss';

const config: Pick<Config, 'presets'> = {
  presets: [
    {
      ...sharedConfig,
      content: [
        './index.html',
        './src/**/*.{ts,tsx}',
        '../packages/ui/src/**/*{.js,.ts,.jsx,.tsx}'
      ]
    }
  ]
};

export default config;
