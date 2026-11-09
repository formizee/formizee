import sharedConfig from '@formizee/tailwind';
import type {TailwindConfig} from '@react-email/tailwind';

const config: TailwindConfig = {
  presets: [sharedConfig as unknown as TailwindConfig]
};

export default config;
