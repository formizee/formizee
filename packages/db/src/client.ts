import {
  type NeonHttpDatabase,
  drizzle as neonDrizzle
} from 'drizzle-orm/neon-http';
import {
  type NodePgDatabase,
  drizzle as pgDrizzle
} from 'drizzle-orm/node-postgres';
import {neon} from '@neondatabase/serverless';
import {Pool as pgPool} from 'pg';

import * as schema from './schema';

type Enviroment = 'test' | 'development' | 'production' | 'preview';

export const createConnection = (
  databaseUrl: string,
  enviroment: Enviroment = 'development'
): Database => {
  if (enviroment === 'production' || enviroment === 'preview') {
    const client = neon(databaseUrl);
    return neonDrizzle(client, {schema});
  }

  const client = new pgPool({connectionString: databaseUrl});
  return pgDrizzle(client, {schema});
};

export type Database =
  | NodePgDatabase<typeof schema>
  | NeonHttpDatabase<typeof schema>;
