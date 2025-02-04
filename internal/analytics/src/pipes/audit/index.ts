import type {Inserter, Querier} from '../../client';
import {params, schema} from './schema';
import {z} from 'zod';

export function insertAuditLogs(ch: Inserter) {
  return ch.insert({
    table: 'audit.raw_audit_logs_v1',
    schema
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
