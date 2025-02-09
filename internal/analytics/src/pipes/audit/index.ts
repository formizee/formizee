import type {Inserter, Querier} from '../../client';
import {params, events} from './schema';
import {newId} from '@formizee/id';
import {z} from 'zod';

export function insertAuditLogs(ch: Inserter) {
  const id = newId('auditlog');

  return ch.insert({
    table: 'audit.raw_audit_logs_v1',
    schema: z.object({
      /**
       * The workspace owning this audit log
       */
      workspaceId: z.string(),

      /**
       * Buckets are used as namespaces for different logs belonging to a single workspace
       */
      auditLogId: z.string().default(id),
      event: events,
      description: z.string().optional(),
      time: z.number(),
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
        .optional(),
      actor: z.object({
        type: z.enum(['user', 'key']),
        id: z.string(),
        name: z.string().optional(),
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
    })
  });
}

export function getLatestAuditLogs(ch: Querier) {
  const schema = z
    .object({
      time: z.number(),
      event: events,
      auditLogId: z.string(),
      description: z.string().optional(),
      workspaceId: z.string(),
      actor_id: z.string(),
      actor_name: z.string().nullable(),
      actor_type: z.enum(['user', 'key']),
      actor_meta: z
        .record(
          z.union([
            z.string(),
            z.number(),
            z.boolean(),
            z.null(),
            z.undefined()
          ])
        )
        .optional(),
      context_location: z.string(),
      context_userAgent: z.string().optional(),
      meta: z.string().optional()
    })
    .transform(data => ({
      workspaceId: data.workspaceId,
      auditLogId: data.auditLogId,
      event: data.event,
      description: data.description || undefined,
      time: data.time,
      actor: {
        type: data.actor_type,
        id: data.actor_id,
        name: data.actor_name ?? undefined,
        meta: data.actor_meta ?? undefined
      },
      context: {
        location: data.context_location,
        userAgent: data.context_userAgent || undefined
      },
      meta: data.meta ?? undefined // Add meta if required
    }));

  return async (args: z.input<typeof params>) => {
    const query = `
SELECT 
    time,
    event,
    auditLogId,
    description,
    workspaceId,
    actor.id as actor_id,
    actor.name as actor_name,
    actor.type as actor_type,
    context.location as context_location,
    context.userAgent as context_userAgent
FROM 
    audit.raw_audit_logs_v1
WHERE
    workspaceId = {workspaceId: String}
    AND time >= (toUnixTimestamp(now()) * 1000 - 7 * 24 * 60 * 60 * 1000)
GROUP BY 
    time,
    event,
    description,
    workspaceId,
    actor_id,
    actor_name,
    actor_type,
    auditLogId,
    context_location,
    context_userAgent
ORDER BY 
    time DESC
    `;

    return ch.query({
      query,
      params,
      schema
    })(args);
  };
}
