import project from '../../../package.json';
import {z} from 'zod';

export const zEnv = z.object({
  // General
  ENVIROMENT: z.enum(['test', 'preview', 'development', 'production']),
  VERSION: z.string().default(project.version),
  DOCS_URL: z.string().url(),

  // Analytics
  TINYBIRD_URL: z.string().url().optional(),
  TINYBIRD_TOKEN: z.string().optional(),

  //Cloudflare Bindings
  cache: z.custom<KVNamespace>(),
  keys: z.custom<KVNamespace>(),

  // Database
  DATABASE_URL: z.string().url().default('http://locahost:8081'),
  DATABASE_AUTH_TOKEN: z.string().optional(),

  // Storage
  STORAGE_ACCESS_KEY_ID: z.string().default('minio_root_user'),
  STORAGE_SECRET_ACCESS_KEY: z.string().default('minio_root_password'),
  STORAGE_ENDPOINT: z.string().url().default('http://localhost:3902'),
  STORAGE_BUCKET: z.string().default('storage'),

  /* --- Secrets --- */
  // Used to encrypt the dek's that encrypts submissions
  MASTER_KEY_V1: z.string(),
  // Bearer token to access the service
  VAULT_SECRET: z.string()
});

export type Env = z.infer<typeof zEnv>;
