import {drizzle} from 'drizzle-orm/node-postgres';
import {sha256} from '@formizee/hashing';
import {newId} from '@formizee/id';
import {env} from '../env';
import pg from 'pg';

import {
  key,
  user,
  endpoint,
  workspace,
  submission,
  usersToEmails,
  usersToWorkspaces
} from './schema';

async function main() {
  const client = new pg.Client({connectionString: env.DATABASE_URL});
  client.connect();

  const db = drizzle(client);

  const workspaces = await db
    .insert(workspace)
    .values([
      {
        id: newId('workspace'),
        slug: 'formizee',
        stripeId: 'stripeId1',
        subscriptionId: 'subscriptionId',
        availableEmails: ['pauchiner@formizee.com'],
        plan: 'pro',
        endsAt: null,
        paidUntil: null
      }
    ])
    .returning();

  if (!workspaces[0]) {
    console.error("\x1b[31m\x1b[0m] database can't be seeded.");
    return;
  }

  const users = await db
    .insert(user)
    .values({
      id: newId('user'),
      name: 'pauchiner',
      slug: 'pauchiner',
      isVerified: true,
      email: 'pauchiner@formizee.com'
    })
    .returning();

  if (!users[0]) {
    console.error("\x1b[31m\x1b[0m] database can't be seeded.");
    return;
  }

  await db.insert(usersToWorkspaces).values({
    workspaceId: workspaces[0].id,
    userId: users[0].id,
    role: 'owner'
  });

  await db.insert(usersToEmails).values({
    isVerified: true,
    userId: users[0].id,
    email: 'pauchiner@formizee.com'
  });

  const endpoints = await db
    .insert(endpoint)
    .values({
      id: newId('endpoint'),
      slug: 'my-endpoint',
      workspaceId: workspaces[0].id,
      targetEmails: ['pauchiner@formizee.com'],
      redirectUrl: 'https://formizee.com/thanks-you'
    })
    .returning();

  if (!endpoints[0]) {
    console.error("\x1b[31m\x1b[0m] database can't be seeded.");
    return;
  }

  await db.insert(submission).values({
    id: newId('endpoint'),
    data: {example: 'formizee'},
    endpointId: endpoints[0].id
  });

  const apiKey = newId('key');
  const hash = await sha256(apiKey);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await db.insert(key).values({
    id: newId('api'),
    name: 'example key',
    userId: users[0].id,
    workspaceId: workspaces[0].id,
    hash,
    expiresAt
  });

  console.info(' \x1b[0m[\x1b[31m✓\x1b[0m] database seeded successfully.\n');
  console.info(` \x1b[33m${apiKey}\x1b[0m`);
  console.info(' enjoy!');
  process.exit(0);
}

main().catch(e => {
  console.error(" \x1b[0m[\x1b[31m\x1b[0m] database can't be seeded.");
  console.error(e);
  process.exit(1);
});
