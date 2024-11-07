import project from '../../../package.json';
import {z} from 'zod';

export const zEnv = z.object({
  // General
  ENVIROMENT: z.enum(['test', 'preview', 'development', 'production']),
  VERSION: z.string().default(project.version),
  DOCS_URL: z.string().url(),

  //Cloudflare Bindings
  VAULT: z.custom<KVNamespace>(),
  BUCKET: z.custom<R2Bucket>(),

  // Secrets
  VAULT_SECRET: z.string(),

  // Analytics
  TINYBIRD_URL: z.string().url().optional(),
  TINYBIRD_TOKEN: z.string().optional()
});

export type Env = z.infer<typeof zEnv>;
