import {type NodePgDatabase, drizzle} from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import {Pool} from 'pg';


export const createConnection = (databaseUrl: string) => {
  const client = new Pool({connectionString: databaseUrl});
  return drizzle(client, {schema});
}

export type Database = NodePgDatabase<typeof schema>
