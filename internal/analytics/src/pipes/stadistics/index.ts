import type {Querier} from '../../client';
import {z} from 'zod';

export function getFormizeeStadistics(ch: Querier) {
  return async (args: object) => {
    const query = `
SELECT 
    (SELECT COUNT(*) FROM metrics.raw_api_requests_v1) AS requests,
    (SELECT COUNT(*) FROM metrics.raw_submissions_v1) AS submissions
    `;

    return ch.query({
      query,
      schema: z.object({
        requests: z.number(),
        submissions: z.number()
      })
    })(args);
  };
}
