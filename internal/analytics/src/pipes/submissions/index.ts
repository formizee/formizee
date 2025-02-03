import type {Inserter, Querier} from '@/client';
import {params, schema} from './schema';
import {z} from 'zod';

export function insertSubmissions(ch: Inserter) {
  return ch.insert({
    table: 'metrics.raw_submissions_v1',
    schema
  });
}

export function getSubmissionsPerDay(ch: Querier) {
  return async (args: z.input<typeof params>) => {
    const query = `
SELECT
    toStartOfDay(uploadedAt) AS dateTime,
    count() AS submissions
 FROM metrics.raw_submissions_v1
    WHERE endpointId = {endpointId}
    AND uploadedAt >= now() - INTERVAL 1 DAY
GROUP BY
    dateTime
ORDER BY
    dateTime DESC
    `;

    return ch.query({
      query,
      params: params,
      schema: z.object({
        dateTime: z.string(),
        submissions: z.number()
      })
    })(args);
  };
}

export function getSubmissionsPerMonth(ch: Querier) {
  return async (args: z.input<typeof params>) => {
    const query = `
SELECT
    toStartOfDay(uploadedAt) AS dateTime,
    count() AS submissions
 FROM metrics.raw_submissions_v1
    WHERE endpointId = {endpointId}
    AND uploadedAt >= now() - INTERVAL 30 DAY
GROUP BY
    dateTime
ORDER BY
    dateTime DESC
    `;

    return ch.query({
      query,
      params: params,
      schema: z.object({
        dateTime: z.string(),
        submissions: z.number()
      })
    })(args);
  };
}

export function getSubmissionsPerEndpoint(ch: Querier) {
  return async (args: z.input<typeof params>) => {
    const query = `
SELECT
    count() AS submissions
 FROM metrics.raw_submissions_v1
    WHERE endpointId = {endpointId}
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
