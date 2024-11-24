import {type LibSQLDatabase, drizzle as sqlDrizzle} from 'drizzle-orm/libsql';
import {createClient} from '@libsql/client';

import * as schema from './schema';

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
