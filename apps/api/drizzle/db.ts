import fs from 'node:fs';
import path from 'node:path';
import { drizzle } from 'drizzle-orm/node-postgres';
import { PostgreSqlContainer } from '@testcontainers/postgresql'
import { eq as _eq, ne as _ne, and as _and } from 'drizzle-orm';
import pg from 'pg';
import * as schemas from './schemas';
import '@/lib/enviroment';

// Schemas
export const users = schemas.users;
export const teams = schemas.teams;
export const members = schemas.members;
export const apiKeys = schemas.apiKeys;
export const waitlist = schemas.waitlist;
export const endpoints = schemas.endpoints;
export const authTokens = schemas.authTokens;
export const submissions = schemas.submissions;
export const linkedEmails = schemas.linkedEmails;

const createTables = async (pgClient: pg.Client): Promise<void> => {
  const migrationsDir = path.join(process.cwd(), 'drizzle', 'migrations');
  const migrationFiles = fs.readdirSync(migrationsDir).filter(file => file.includes('.sql'));

  for (const file of migrationFiles) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');
    await pgClient.query(sql)
  }
}

const getClientInstance = async (): Promise<pg.Client> => {
  let client: pg.Client | null = null;

  if (process.env.NODE_ENV === 'test') {
    const testingPgContainer = await new PostgreSqlContainer().start();
    client = new pg.Client({ connectionString: testingPgContainer.getConnectionUri() });
    await client.connect();
    await createTables(client);
  }
  else {
    client = new pg.Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
  }
  return client;
}

const client = await getClientInstance();

export const db = drizzle(client, { schema: schemas });

// Drizzle Operators
export const eq = _eq;
export const ne = _ne;
export const and = _and;
