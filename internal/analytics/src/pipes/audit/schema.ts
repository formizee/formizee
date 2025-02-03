import {newId} from '@formizee/id';
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

export const schema = z.object({
  /**
   * The workspace owning this audit log
   */
  workspaceId: z.string(),

  /**
   * Buckets are used as namespaces for different logs belonging to a single workspace
   */
  auditLogId: z.string().default(newId('auditlog')),
  event: events,
  description: z.string().optional(),
  time: z.number(),
  meta: z
    .record(
      z.union([z.string(), z.number(), z.boolean(), z.null(), z.undefined()])
    )
    .optional(),
  actor: z.object({
    type: z.enum(['user', 'key']),
    id: z.string(),
    name: z.string().optional(),
    meta: z
      .record(
        z.union([z.string(), z.number(), z.boolean(), z.null(), z.undefined()])
      )
      .optional()
  }),
  resources: z.array(
    z.object({
      type: z.enum(['key', 'auth', 'user', 'endpoint', 'workspace']),
      name: z.string().optional(),
      id: z.string(),
      meta: z
        .record(
          z.union([
            z.string(),
            z.number(),
            z.boolean(),
            z.null(),
            z.undefined()
          ])
        )
        .optional()
    })
  ),
  context: z.object({
    location: z.string(),
    userAgent: z.string().optional()
  })
});

export type AuditLog = z.infer<typeof schema>;
