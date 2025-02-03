import type {Querier} from '@/client';
import {z} from 'zod';

const params = z.object({
  workspaceId: z.string(),
  startDate: z.number(),
  endDate: z.number()
});

export function getBillableSubmissions(ch: Querier) {
  return async (args: z.input<typeof params>) => {
    const query = `
SELECT
    count() AS submissions
 FROM metrics.raw_submissions_v1
    WHERE workspaceId = {workspaceId: String}
      AND uploadedAt >= {startDate: Int64}
      AND uploadedAt <= {endDate: Int64}
    `;

    return ch.query({
      query,
      params: params,
      schema: z.object({
        submissions: z.number()
      })
    })(args);
  };
}

export function getBillableApiRequests(ch: Querier) {
  return async (args: z.input<typeof params>) => {
    const query = `
SELECT
    count() AS requests
 FROM metrics.raw_api_requests_v1
    WHERE workspace_id = {workspaceId: String}
      AND time >= {startDate: Int64}
      AND time <= {endDate: Int64}
    `;

    return ch.query({
      query,
      params: params,
      schema: z.object({
        requests: z.number()
      })
    })(args);
  };
}
