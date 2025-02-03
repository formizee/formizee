import type {Querier} from '@/client';
import {dateTimeToUnix} from '@/utils';
import {z} from 'zod';

const params = z.object({
  workspaceId: z.string(),
  startDate: dateTimeToUnix,
  endDate: dateTimeToUnix
});

export function getBillableSubmissions(ch: Querier) {
  return async (args: z.input<typeof params>) => {
    const query = `
SELECT
    count() AS submissions
 FROM metrics.raw_submissions_v1
    WHERE workspaceId = {workspaceId}
      AND uploadedAt >= {startDate}
      AND uploadedAt <= {endDate}
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
    WHERE workspaceId = {workspaceId}
      AND uploadedAt >= {startDate}
      AND uploadedAt <= {endDate}
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
