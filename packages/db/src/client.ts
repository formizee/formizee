import {drizzle} from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import {env} from '../env';
import pg from 'pg';

const client = new pg.Client({connectionString: env.DATABASE_URL});
client.connect();

export const db = drizzle(client, {schema});
