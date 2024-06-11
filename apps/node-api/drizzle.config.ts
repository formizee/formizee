import {defineConfig} from 'drizzle-kit';
import '@/lib/enviroment';

export default defineConfig({
  schema: './drizzle/schemas.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL_LOCAL ?? '(null)'
  }
});
