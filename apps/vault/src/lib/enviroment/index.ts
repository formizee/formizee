import project from '../../../package.json';
import {z} from 'zod';

export const zEnv = z.object({
  ENVIROMENT: z.enum(['test', 'preview', 'development', 'production']),
  VERSION: z.string().default(project.version),
  VAULT: z.custom<KVNamespace>(),
  BUCKET: z.custom<R2Bucket>(),
  DOCS_URL: z.string().url(),

  // Analytics
  TINYBIRD_URL: z.string().url().optional(),
  TINYBIRD_TOKEN: z.string().optional()
});

export type Env = z.infer<typeof zEnv>;
