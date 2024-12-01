import {z} from 'zod';

export const databaseEnv = z.object({
  DATABASE_URL: z.string().url().default('http://localhost:8080')
});

export const integrationTestEnv = databaseEnv.merge(
  z.object({
    VAULT_URL: z.string().url().default('http://localhost:8888'),
    DOCS_URL: z.string().url().default('http://localhost:3002'),
    WEB_URL: z.string().url().default('http://localhost:3000'),
    API_URL: z.string().url().default('http://localhost:8787')
  })
);
