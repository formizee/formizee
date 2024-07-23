import {createEnv} from '@t3-oss/env-core';
import 'dotenv/config';
import {z} from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(['test', 'development', 'production'])
      .default('development'),
    TESTING_DATABASE_URL: z.string().url(),
    DATABASE_URL: z.string().url()
  },
  skipValidation: true,
  runtimeEnv: process.env,
  emptyStringAsUndefined: true
});
