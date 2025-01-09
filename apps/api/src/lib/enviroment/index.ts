import type {Fetcher} from '@cloudflare/workers-types';
import project from '../../../package.json';
import {z} from 'zod';

export const zEnv = z.object({
  // General
  ENVIROMENT: z.enum(['test', 'preview', 'development', 'production']),
  DASHBOARD_URL: z.string().url().default('http://localhost:3001'),
  VAULT_URL: z.string().url().default('http://localhost:8888'),
  DOCS_URL: z.string().url().default('http://localhost:3002'),
  WEB_URL: z.string().url().default('http://localhost:3000'),
  API_URL: z.string().url().default('http://localhost:8787'),
  VERSION: z.string().default(project.version),

  //Cloudflare Bindings
  cache: z.custom<KVNamespace>(),
  vault: z.custom<Fetcher>(),

  // Databases
  DATABASE_URL: z.string().url().default('http://localhost:8080'),
  DATABASE_AUTH_TOKEN: z.string().optional(),

  // Storage
  VAULT_SECRET: z.string().default(''),

  // Analytics
  TINYBIRD_URL: z.string().url().optional(),
  TINYBIRD_TOKEN: z.string().optional(),

  // Logs
  LOGTAIL_TOKEN: z.string(),
  EMIT_LOGS: z
    .string()
    .toLowerCase()
    .transform(x => x === 'true')
    .pipe(z.boolean()),

  /* --- Secrets --- */

  // Communication
  RESEND_TOKEN: z.string().optional()
});

export type Env = z.infer<typeof zEnv>;
