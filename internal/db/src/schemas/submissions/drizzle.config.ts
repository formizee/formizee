import type {Config} from 'drizzle-kit';

export default {
  schema: './src/schemas/submissions/index.ts',
  out: './migrations/submissions/',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.SUBMISSIONS_DATABASE_URL!,
    authToken: process.env.SUBMISSIONS_DATABASE_AUTH_TOKEN!
  }
} satisfies Config;
