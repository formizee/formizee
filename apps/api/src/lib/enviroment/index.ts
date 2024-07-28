import {createEnv} from '@t3-oss/env-core';
import project from '../../../package.json';
import 'dotenv/config';
import {z} from 'zod';

export const env = createEnv({
  server: {
    // General
    NODE_ENV: z.enum(['test', 'development', 'production']),
    VERSION: z.string().default(project.version),
    DOCS_URL: z.string().url(),
    WEB_URL: z.string().url(),
    API_URL: z.string().url(),

    // Analytics
    TINYBIRD_URL: z.string().url().optional(),
    TINYBIRD_TOKEN: z.string().optional(),

    // Database
    TESTING_DATABASE_URL: z.string().url(),
    DATABASE_URL: z.string().url(),

    // Communication
    RESEND_TOKEN: z.string()
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true
});
