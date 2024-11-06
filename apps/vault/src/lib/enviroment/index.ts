import project from '../../../package.json';
import {z} from 'zod';

export const zEnv = z.object({
  ENVIROMENT: z.enum(['test', 'preview', 'development', 'production']),
  VERSION: z.string().default(project.version),
  DOCS_URL: z.string().url(),
  VAULT: z.custom<R2Bucket>(),

  // Analytics
  TINYBIRD_URL: z.string().url().optional(),
  TINYBIRD_TOKEN: z.string().optional()
});

export type Env = z.infer<typeof zEnv>;
