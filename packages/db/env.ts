import {createEnv} from '@t3-oss/env-core';
import 'dotenv/config';
import {z} from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['test', 'development', 'production']).default('test'),
    DATABASE_URL: z
      .string()
      .url()
      .default('postgresql://formizee:formizee@localhost/test')
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true
});
