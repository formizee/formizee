import {drizzle} from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import {env} from '../env';
import pg from 'pg';

const connectionString =
  env.NODE_ENV !== 'test' ? env.DATABASE_URL : env.TESTING_DATABASE_URL;

const client = new pg.Client({connectionString});
client.connect();

export const db = drizzle(client, {schema});
