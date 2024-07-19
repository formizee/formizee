import {createEnv} from '@t3-oss/env-core';
import {z} from 'zod';

export const env = createEnv({
  server: {
    SUPPORT_EMAIL: z.string().email(),
    SMTP_HOST: z.string().url(),
    SMTP_PASSWORD: z.string(),
    SMTP_USER: z.string()
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true
});
