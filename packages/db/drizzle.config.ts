import {defineConfig} from 'drizzle-kit';
import {env} from './env';

export default defineConfig({
  schema: './src/schema/index.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.NODE_ENV === 'test' ? env.TESTING_DATABASE_URL : env.DATABASE_URL
  }
});
