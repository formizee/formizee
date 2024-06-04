import type { D1Database } from '@cloudflare/workers-types';

export type Env = {
  DB: D1Database;
  WORKER_ENV: string;
  SMTP_SECRET: string;
  LOGTAIL_SECRET: string;
  SESSION_SECRET: string;
}
