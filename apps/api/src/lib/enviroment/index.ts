import project from '../../../package.json';
import {z} from 'zod';

export const zEnv = z.object({
  ENVIROMENT: z.enum(['test', 'preview', 'development', 'production']),
  VERSION: z.string().default(project.version),
  DOCS_URL: z.string().url(),
  WEB_URL: z.string().url(),
  API_URL: z.string().url(),

  // Analytics
  TINYBIRD_URL: z.string().url().optional(),
  TINYBIRD_TOKEN: z.string().optional(),

  // Storage
  DATABASE_URL: z.string().url(),
  VAULT_SECRET: z.string(),

  // Communication
  RESEND_TOKEN: z.string()
});

export type Env = z.infer<typeof zEnv>;
