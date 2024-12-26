import {createClient} from '@libsql/client/web';
import {schema, drizzle} from '@formizee/db/web';
import {env} from '@/lib/environment';

const client = createClient({
  url: env().DATABASE_URL,
  authToken: env().DATABASE_AUTH_TOKEN
});

export const database = drizzle(client, {schema});

export * from '@formizee/db/web';
