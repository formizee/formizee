import {type LibSQLDatabase, drizzle as sqlDrizzle} from 'drizzle-orm/libsql';
import {createClient} from '@libsql/client/web';

// Drizzle utilities & schemas
import * as schema from './schemas/main';
export * from 'drizzle-orm';
export {schema};

// Connections
export const createConnection = (opts: {
  databaseUrl: string;
  authToken?: string;
}): Database => {
  const client = createClient({
    url: opts.databaseUrl,
    authToken: opts.authToken ?? undefined
  });
  return sqlDrizzle(client, {schema});
};

export type Database = LibSQLDatabase<typeof schema>;
