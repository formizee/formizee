import {
  type NeonHttpDatabase,
  drizzle as neonDrizzle
} from 'drizzle-orm/neon-http';
import {neon} from '@neondatabase/serverless';

import * as schema from './schema';

export const createConnection = (databaseUrl: string): Database => {
  const client = neon(databaseUrl);
  return neonDrizzle(client, {schema});
};

export type Database = NeonHttpDatabase<typeof schema>;
