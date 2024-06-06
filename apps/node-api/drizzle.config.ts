import {defineConfig} from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
    host: process.env.POSTGRES_HOST!,
    database: process.env.POSTGRES_DATABASE!
  },
});
