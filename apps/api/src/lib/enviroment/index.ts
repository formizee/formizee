import {createEnv} from '@t3-oss/env-core';
import 'dotenv/config';
import {z} from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['test', 'development', 'production']),
    DATABASE_URL: z.string().url(),
    WEB_URL: z.string().url(),
    API_URL: z.string().url(),
    DOCS_URL: z.string().url(),
    JWT_SECRET: z.string()
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true
});
