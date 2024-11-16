import {auditLogSchemaV1, formizeeAuditLogEvents} from './auditlog';
import {NoopTinybird, Tinybird} from '@chronark/zod-bird';
import type {MaybeArray} from './types';
import {metricSchema, type Metric} from './metrics';
import {newId} from '@formizee/id';
import {z} from 'zod';

export class Analytics {
  public readonly client: Tinybird | NoopTinybird;

  constructor(opts: {
    tinybirdUrl?: string;
    tinybirdToken?: string;
  }) {
    this.client = opts.tinybirdToken
      ? new Tinybird({token: opts.tinybirdToken, baseUrl: opts.tinybirdUrl})
      : new NoopTinybird();
  }

  public get ingestSdkTelemetry() {
    return this.client.buildIngestEndpoint({
      datasource: 'sdk_telemetry__v1',
      event: z.object({
        runtime: z.string(),
        platform: z.string(),
        versions: z.array(z.string()),
        requestId: z.string(),
        time: z.number()
      })
    });
  }

  public async ingestFormizeeMetrics(metric: Metric) {
    const metricType = metric.metric.split('.')[0] ?? '';
    const type = metricType === '' ? '' : `${metricType}__`;

    const publishEvent = this.client.buildIngestEndpoint({
      datasource: `metrics__${type}v1`,
      event: metricSchema
    });

    try {
      await publishEvent(metric);
    } catch (e) {
      const error = e as Error;
      console.error(error.message);
    }
  }

  public async ingestFormizeeAuditLogs(logs: MaybeArray<FormizeeAuditLog>) {
    const publishEvent = this.client.buildIngestEndpoint({
      datasource: 'audit_logs__v1',
      event: auditLogSchemaV1
        .merge(
          z.object({
            event: formizeeAuditLogEvents,
            auditLogId: z.string().default(newId('auditlog')),
            bucket: z.string().default('formizee_mutations'),
            time: z.number().default(Date.now())
          })
        )
        .transform(l => ({
          ...l,
          meta: l.meta ? JSON.stringify(l.meta) : undefined,
          actor: {
            ...l.actor,
            meta: l.actor.meta ? JSON.stringify(l.actor.meta) : undefined
          },
          resources: JSON.stringify(l.resources)
        }))
    });

    try {
      await publishEvent(logs);
    } catch (e) {
      const error = e as Error;
      console.error(error.message);
    }
  }

  public async queryFormizeeAuditLogs(workspaceId: string) {
    const queryPipe = this.client.buildPipe({
      pipe: 'audit_logs__pipe__v1',
      parameters: z.object({
        workspaceId: z.string()
      }),
      data: z.object({
        actor_id: z.string(),
        actor_name: z.string(),
        actor_type: z.string().optional(),
        description: z.string().optional(),
        event: z.string(),
        time: z.number().transform(t => new Date(t).getTime())
      })
    });

    try {
      const response = await queryPipe({workspaceId});
      return response.data;
    } catch (e) {
      const error = e as Error;
      console.error(error.message);
    }
  }

  public async queryFormizeeMonthlySubmissions(
    workspaceId: string,
    startDate: Date,
    endDate: Date
  ) {
    const queryPipe = this.client.buildPipe({
      pipe: 'submissions__pipe__v1',
      parameters: z.object({
        workspaceId: z.string(),
        startDate: z.string(),
        endDate: z.string()
      }),
      data: z.object({
        count: z.number()
      })
    });

    try {
      const response = await queryPipe({
        workspaceId,
        startDate: startDate.toISOString().replace('T', ' ').replace('Z', ''),
        endDate: endDate.toISOString().replace('T', ' ').replace('Z', '')
      });

      return response.data[0]?.count ?? 0;
    } catch (e) {
      const error = e as Error;
      console.error(error.message);
    }
    return 0;
  }

  public async queryFormizeeDailyRequests(workspaceId: string) {
    const now = new Date();

    const startDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0
    );

    const endDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999
    );

    const queryPipe = this.client.buildPipe({
      pipe: 'api__requests__pipe__v1',
      parameters: z.object({
        workspaceId: z.string(),
        startDate: z.string(),
        endDate: z.string()
      }),
      data: z.object({
        count: z.number()
      })
    });

    try {
      const response = await queryPipe({
        workspaceId,
        startDate: startDate.toISOString().replace('T', ' ').replace('Z', ''),
        endDate: endDate.toISOString().replace('T', ' ').replace('Z', '')
      });

      return response.data[0]?.count ?? 0;
    } catch (e) {
      const error = e as Error;
      console.error(error.message);
    }
    return 0;
  }
}

export type FormizeeAuditLog = {
  workspaceId: string;
  event: z.infer<typeof formizeeAuditLogEvents>;
  description: string;
  actor: {
    type: 'user' | 'key';
    name?: string;
    id: string;
  };
  resources: Array<{
    type: 'key' | 'auth' | 'user' | 'endpoint' | 'workspace';
    id: string;
    meta?: Record<string, string | number | boolean | null | undefined>;
  }>;
  context: {
    userAgent?: string;
    location: string;
  };
};
