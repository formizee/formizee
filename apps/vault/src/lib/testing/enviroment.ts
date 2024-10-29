import {z} from 'zod';

export const databaseEnv = z.object({
  DATABASE_URL: z
    .string()
    .url()
    .default('postgresql://formizee:password@localhost/formizee')
});

export const integrationTestEnv = databaseEnv.merge(
  z.object({
    DOCS_URL: z.string().url().default('http://localhost:3002'),
    WEB_URL: z.string().url().default('http://localhost:3000'),
    API_URL: z.string().url().default('http://localhost:8787')
  })
);
