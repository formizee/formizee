import {drizzle} from 'drizzle-orm/node-postgres';
import {eq as _eq, ne as _ne, and as _and} from 'drizzle-orm';
import pg from 'pg';
import * as schemas from './schemas';
import '@/lib/enviroment';

// Schemas
export const users = schemas.users;
export const teams = schemas.teams;
export const members = schemas.members;
export const waitlist = schemas.waitlist;
export const endpoints = schemas.endpoints;
export const authTokens = schemas.authTokens;
export const submissions = schemas.submissions;
export const linkedEmails = schemas.linkedEmails;

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL
});
await client.connect();

export const db = drizzle(client, {schema: schemas});

// Drizzle Operators
export const eq = _eq;
export const ne = _ne;
export const and = _and;
