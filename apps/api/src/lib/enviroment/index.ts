import project from '../../../package.json';
import {z} from 'zod';

export const zEnv = z.object({
  // General
  ENVIROMENT: z.enum(['test', 'preview', 'development', 'production']),
  DASHBOARD_URL: z.string().url().default('http://localhost:3001'),
  DOCS_URL: z.string().url().default('http://localhost:3002'),
  WEB_URL: z.string().url().default('http://localhost:3000'),
  API_URL: z.string().url().default('http://localhost:8787'),
  VERSION: z.string().default(project.version),

  //Cloudflare Bindings
  cache: z.custom<KVNamespace>(),
  keys: z.custom<KVNamespace>(),

  // Databases
  DATABASE_URL: z.string().url().default('http://localhost:8080'),
  DATABASE_AUTH_TOKEN: z.string().optional(),

  // Storage
  STORAGE_SECRET_ACCESS_KEY: z.string().default('minio_root_password'),
  STORAGE_ENDPOINT: z.string().url().default('http://localhost:3902'),
  STORAGE_ACCESS_KEY_ID: z.string().default('minio_root_user'),
  STORAGE_BUCKET: z.string().default('storage'),
  VAULT_SECRET: z.string().default(''),

  // Analytics
  TINYBIRD_URL: z.string().url().optional(),
  TINYBIRD_TOKEN: z.string().optional(),

  // Communication
  RESEND_TOKEN: z.string().optional()
});

export type Env = z.infer<typeof zEnv>;
