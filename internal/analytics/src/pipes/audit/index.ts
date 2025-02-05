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
  return async (args: z.input<typeof params>) => {
    const query = `
SELECT 
    workspaceId,
    actor_id,
    actor_name,
    actor_type,
    auditLogId,
    context_location,
    context_userAgent,
    description,
    event,
    resources,
    time
FROM 
    audit.raw_audit_logs_v1
WHERE
    workspaceId = {workspaceId: String}
    AND time >= (toUnixTimestamp(now()) * 1000 - 7 * 24 * 60 * 60 * 1000)
GROUP BY 
    workspaceId,
    actor_id,
    actor_name,
    actor_type,
    auditLogId,
    context_location,
    context_userAgent,
    description,
    event,
    resources,
    time
ORDER BY 
    time DESC
    `;

    return ch.query({
      query,
      params,
      schema: z.any()
    })(args);
  };
}
