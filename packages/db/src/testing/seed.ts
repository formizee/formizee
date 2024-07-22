import {drizzle} from 'drizzle-orm/node-postgres';
import {sha256} from '@formizee/hashing';
import {env} from '../../env';
import {schema} from '..';
import pg from 'pg';

const getTestingClient = async () => {
  const client = new pg.Client({connectionString: env.TESTING_DATABASE_URL});
  await client.connect();

  return drizzle(client, {schema: schema});
};

const generateResources = async () => {
  const workspace = {
    id: 'ws_9CWDA9MKp3UHDwyqxrBt5AbEWfJ',
    slug: 'formizee',
    stripeId: 'stripeId1',
    subscriptionId: 'subscriptionId',
    availableEmails: ['pauchiner@formizee.com'],
    plan: 'pro'
  };

  const user: schema.InsertUser = {
    id: 'id_9CWDA9MKp3UHDwyqxrBt5AbEWfJ',
    name: 'pauchiner',
    slug: 'pauchiner',
    isVerified: true,
    email: 'pauchiner@formizee.com'
  };

  const usersToWorkspaces = {
    workspaceId: 'ws_9CWDA9MKp3UHDwyqxrBt5AbEWfJ',
    userId: 'id_9CWDA9MKp3UHDwyqxrBt5AbEWfJ',
    role: 'owner'
  };

  const usersToEmails = {
    isVerified: true,
    email: 'pauchiner@formizee.com',
    userId: 'id_9CWDA9MKp3UHDwyqxrBt5AbEWfJ'
  };

  const endpoint: schema.InsertEndpoint = {
    id: 'enp_9CWDA9MKp3UHDwyqxrBt5AbEWfJ',
    slug: 'my-endpoint',
    targetEmails: ['pauchiner@formizee.com'],
    workspaceId: 'ws_9CWDA9MKp3UHDwyqxrBt5AbEWfJ',
    redirectUrl: 'https://formizee.com/thanks-you'
  };

  const submission: schema.InsertSubmission = {
    data: {example: 'formizee'},
    id: 'sub_9CWDA9MKp3UHDwyqxrBt5AbEWfJ',
    endpointId: 'enp_9CWDA9MKp3UHDwyqxrBt5AbEWfJ'
  };

  const key = {
    name: 'example key',
    id: 'api_9CWDA9MKp3UHDwyqxrBt5AbEWfJ',
    userId: 'id_9CWDA9MKp3UHDwyqxrBt5AbEWfJ',
    workspaceId: 'ws_9CWDA9MKp3UHDwyqxrBt5AbEWfJ',
    hash: await sha256('fz_9CWDA9MKp3UHDwyqxrBt5AbEWfJ'),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
  };

  return {
    key,
    user,
    endpoint,
    workspace,
    submission,
    usersToEmails,
    usersToWorkspaces
  };
};

export async function seedDatabase() {
  const db = await getTestingClient();

  const {key, user, endpoint, submission, usersToEmails} =
    await generateResources();

  try {
    await db.transaction(async tx => {
      await tx.insert(schema.workspace).values([
        {
          id: 'ws_9CWDA9MKp3UHDwyqxrBt5AbEWfJ',
          slug: 'formizee',
          stripeId: 'stripeId1',
          subscriptionId: 'subscriptionId',
          availableEmails: ['pauchiner@formizee.com'],
          plan: 'pro'
        }
      ]);
      await tx.insert(schema.user).values(user);
      await tx.insert(schema.usersToWorkspaces).values({
        workspaceId: 'ws_9CWDA9MKp3UHDwyqxrBt5AbEWfJ',
        userId: 'id_9CWDA9MKp3UHDwyqxrBt5AbEWfJ',
        role: 'owner'
      });
      await tx.insert(schema.usersToEmails).values(usersToEmails);
      await tx.insert(schema.endpoint).values(endpoint);
      await tx.insert(schema.submission).values(submission);
      await tx.insert(schema.key).values(key);
    });
  } catch (e) {
    console.error(" \x1b[0m[\x1b[31m\x1b[0m] database can't be seeded.");
    console.error(e);
  }
}

export async function clearDatabase() {
  const db = await getTestingClient();

  try {
    await db.transaction(async tx => {
      await tx.delete(schema.key);
      await tx.delete(schema.submission);
      await tx.delete(schema.endpoint);
      await tx.delete(schema.usersToEmails);
      await tx.delete(schema.usersToWorkspaces);
      await tx.delete(schema.user);
      await tx.delete(schema.workspace);
    });
  } catch (e) {
    console.error(" \x1b[0m[\x1b[31m\x1b[0m] database can't be cleared.");
    console.error(e);
  }
}
