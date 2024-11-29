import {createClient} from '@libsql/client/web';
import {schema, drizzle} from '@formizee/db/web';
import {env} from '@/lib/enviroment';

const client = createClient({
  url: env().DATABASE_URL,
  authToken:
    env().VERCEL_ENV === 'development' ? undefined : env().DATABASE_AUTH_TOKEN
});

export const database = drizzle(client, {schema});

export * from '@formizee/db/web';
