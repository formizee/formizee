import {z} from 'zod';

export const testingEnviroment = z.object({
  // General
  ENVIROMENT: z
    .enum(['test', 'preview', 'development', 'production'])
    .default('test'),
  DOCS_URL: z.string().url().default('https://docs.formizee.com'),
  VAULT_URL: z.string().url().default('http://localhost:8888'),
  VERSION: z.string().default('1.0.0'),

  //Cloudflare Bindings
  cache: z.custom<KVNamespace>(),
  keys: z.custom<KVNamespace>(),

  // Databases
  DATABASE_URL: z.string().url().default('http://localhost:8081'),
  DATABASE_AUTH_TOKEN: z.string().optional(),

  // Storage
  STORAGE_SECRET_ACCESS_KEY: z.string().default('minio_root_password'),
  STORAGE_ENDPOINT: z.string().url().default('http://localhost:3902'),
  STORAGE_ACCESS_KEY_ID: z.string().default('minio_root_user'),
  STORAGE_BUCKET: z.string().default('storage'),

  // Analytics
  TINYBIRD_URL: z.string().url().optional(),
  TINYBIRD_TOKEN: z.string().optional(),

  /* --- Secrets --- */
  // Used to encrypt the dek's that encrypts submissions
  MASTER_KEY_V1: z
    .string()
    .default(
      '"{"key_ops":["encrypt","decrypt"],"ext":true,"kty":"oct","k":"86spvFN-FyWJRAvH3fQlEwxk_0f1msbgIgJZiHTDI5Q","alg":"A256GCM"}"'
    ),
  // Bearer token to access the service
  VAULT_SECRET: z.string()
});

export type TestingEnviroment = z.infer<typeof testingEnviroment>;
