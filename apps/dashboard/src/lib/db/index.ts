import {createConnection} from '@formizee/db';
import {env} from '@/lib/enviroment';

export const database = createConnection({
  databaseUrl: env().DATABASE_URL,
  authToken:
    env().VERCEL_ENV === 'development' ? undefined : env().DATABASE_AUTH_TOKEN
});

export * from '@formizee/db';
