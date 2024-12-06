import type {Config} from 'drizzle-kit';

export default {
  schema: './src/schemas/main/index.ts',
  out: './migrations/main/',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN!
  }
} satisfies Config;
