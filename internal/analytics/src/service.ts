import {
  type FormizeeAuditLog,
  auditLogSchemaV1,
  formizeeAuditLogEvents
} from './auditlog';
import {NoopTinybird, Tinybird} from '@chronark/zod-bird';
import type {MaybeArray} from './types';
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

  /*
   * Used for usage and billing
   */
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

  /*
   * Used for usage and billing
   */
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

  /*
   * Used for Charts and Analytics
   */
  public async queryFormizeeMetricsSubmissions(
    endpointId: string,
    timeRange: '30d' | '24h'
  ) {
    const queryMonthPipe = this.client.buildPipe({
      pipe: 'submissions__metrics__month__pipe__v1',
      parameters: z.object({
        endpointId: z.string()
      }),
      data: z.object({
        dateTime: z.string(),
        submissions: z.number()
      })
    });

    const queryDayPipe = this.client.buildPipe({
      pipe: 'submissions__metrics__day__pipe__v1',
      parameters: z.object({
        endpointId: z.string()
      }),
      data: z.object({
        dateTime: z.string(),
        submissions: z.number()
      })
    });

    if (timeRange === '30d') {
      try {
        const response = await queryMonthPipe({endpointId});

        return response.data;
      } catch (e) {
        const error = e as Error;
        console.error(error.message);
      }
    }

    try {
      const response = await queryDayPipe({endpointId});

      return response.data;
    } catch (e) {
      const error = e as Error;
      console.error(error.message);
    }
  }
}
