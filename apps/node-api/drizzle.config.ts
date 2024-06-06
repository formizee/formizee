import {defineConfig} from 'drizzle-kit';
import '@/lib/enviroment';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL!
  }
});
