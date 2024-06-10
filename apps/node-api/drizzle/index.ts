import {drizzle} from 'drizzle-orm/node-postgres';
import {eq as compare} from 'drizzle-orm';
import pg from 'pg';
import * as schemas from './schema';
import '@/lib/enviroment';

// Schemas
export const users = schemas.users;
export const waitlist = schemas.waitlist;
export const endpoints = schemas.endpoints;
export const authTokens = schemas.authTokens;
export const submissions = schemas.submissions;

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL
});
await client.connect();

// Drizzle Utilities
export const db = drizzle(client, {schema: schemas});
export const eq = compare;
