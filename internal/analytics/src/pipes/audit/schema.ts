import {z} from 'zod';

export const params = z.object({
  workspaceId: z.string()
});

export const events = z.enum([
  // Workspace
  'workspace.create',
  'workspace.update',
  'workspace.delete',
  'workspace.member.create',
  'workspace.member.update',
  'workspace.member.delete',

  // Authentication
  'auth.user.login',
  'auth.user.logout',
  'auth.user.register',
  'auth.user.delete',

  // User
  'user.password.update',
  'user.email.update',
  'user.name.update',
  'user.slug.update',
  'user.emails.create',
  'user.emails.verify',
  'user.emails.delete',

  // Endpoint
  'endpoint.create',
  'endpoint.update',
  'endpoint.delete',

  // Key
  'key.create',
  'key.verify',
  'key.update',
  'key.delete'
]);
