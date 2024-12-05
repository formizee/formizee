import type {EmailConfig} from 'next-auth/providers';
import type {AdapterUser} from 'next-auth/adapters';
import {generateSlug} from 'random-word-slugs';
import {database, schema, eq} from '@/lib/db';
import {EmailService} from '@formizee/email';
import {newId} from '@formizee/id';
import {z} from 'zod';

export async function signupDisabled() {
  throw new Error(
    "Signups aren't available right now, wait for the launch of Formizee."
  );
}

export async function createUser(
  data: Omit<AdapterUser, 'id'>
): Promise<AdapterUser> {
  const input = z
    .object({
      name: z.string().optional(),
      email: z.string().email(),
      image: z.string().optional(),
      emailVerified: z.date().nullable().optional()
    })
    .parse(data);

  if (!input.email) {
    throw new Error('Missing email to create a user.');
  }

  let slug: string | undefined = undefined;

  while (!slug) {
    slug = generateSlug(2);
    const slugAlreadyExists = await database.query.user.findFirst({
      where: eq(schema.user.slug, slug)
    });

    if (slugAlreadyExists) {
      slug = undefined;
    }
  }

  const newUser: schema.InsertUser = {
    ...input,
    name: input.name ?? input.email,
    id: newId('user'),
    slug
  };

  await database.insert(schema.user).values(newUser);

  await database.insert(schema.usersToEmails).values({
    userId: newUser.id,
    email: newUser.email,
    isVerified: true
  });

  // Create the personal workspace

  let workspaceSlug: string | undefined = undefined;

  while (!workspaceSlug) {
    workspaceSlug = generateSlug(2);
    const slugAlreadyExists = await database.query.workspace.findFirst({
      where: eq(schema.workspace.slug, workspaceSlug)
    });

    if (slugAlreadyExists) {
      slug = undefined;
    }
  }

  const workspaceId = newId('workspace');
  await database.insert(schema.workspace).values({
    availableEmails: [newUser.email],
    name: 'Personal Workspace',
    slug: workspaceSlug,
    id: workspaceId
  });

  await database.insert(schema.usersToWorkspaces).values({
    workspaceId: workspaceId,
    userId: newUser.id,
    role: 'owner'
  });

  const newEndpoint: schema.InsertEndpoint = {
    id: newId('endpoint'),
    name: 'Welcome Form',
    slug: 'welcome',
    targetEmails: [newUser.email],
    workspaceId,
    redirectUrl: 'https://formizee.com/thanks-you'
  };

  await database.insert(schema.endpoint).values(newEndpoint);

  return {
    emailVerified: newUser.emailVerified ?? null,
    ...newUser
  };
}

export async function getUser(id: string): Promise<AdapterUser | null> {
  const {user} = schema;

  const result = await database
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      emailVerified: user.emailVerified
    })
    .from(user)
    .where(eq(user.id, id));

  if (!result[0]) {
    return null;
  }

  return result[0];
}

export async function sendVerificationRequest(params: {
  provider: EmailConfig;
  identifier: string;
  url: string;
}) {
  const smtp = new EmailService({apiKey: params.provider.apiKey ?? ''});
  await smtp.sendVerifyEmail({email: params.identifier, link: params.url});
}
