import {type LibSQLDatabase, drizzle as sqlDrizzle} from 'drizzle-orm/libsql';
import {createClient} from '@libsql/client/web';

import * as schema from './schema';

export const createConnection = (
  databaseUrl: string,
  authToken: string
): Database => {
  const client = createClient({
    url: databaseUrl,
    authToken
  });
  return sqlDrizzle(client, {schema});
};

export type Database = LibSQLDatabase<typeof schema>;
