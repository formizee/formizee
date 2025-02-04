import type {Inserter} from '@/client';
import {z} from 'zod';

export const cacheSchema = z.discriminatedUnion('type', [
  z.object({
    key: z.string(),
    hit: z.boolean(),
    type: z.literal('read'),
    latency: z.number().transform(latency => Math.round(latency))
  }),
  z.object({
    key: z.string(),
    type: z.literal('write'),
    hit: z.boolean().default(false),
    latency: z.number().transform(latency => Math.round(latency))
  }),
  z.object({
    key: z.string(),
    type: z.literal('delete'),
    hit: z.boolean().default(false),
    latency: z.number().transform(latency => Math.round(latency))
  })
]);

export const databaseSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('read'),
    dbName: z.string().default('main'),
    latency: z.number().transform(latency => Math.round(latency)),
    query: z.enum([
      'users.get',
      'users.list',

      'keys.get',
      'keys.list',
      'keys.count',
      'keys.verify',

      'endpoints.get',
      'endpoints.list',
      'endpoints.count',

      'workspaces.get',
      'workspaces.list',

      'usersToEmails.get',
      'usersToWorkspaces.get',
      'usersToWorkspaces.list'
    ])
  }),
  z.object({
    type: z.literal('write'),
    dbName: z.string().default('main'),
    latency: z.number().transform(latency => Math.round(latency)),
    query: z.enum([
      'users.put',
      'users.post',
      'users.delete',

      'keys.put',
      'keys.post',
      'keys.delete',

      'endpoints.put',
      'endpoints.post',
      'endpoints.delete',

      'workspaces.put',
      'workspaces.post',
      'workspaces.delete',

      'usersToEmails.post',
      'usersToEmails.delete'
    ])
  })
]);

export function insertCacheMetrics(ch: Inserter) {
  return ch.insert({
    table: 'metrics.raw_cache_v1',
    schema: cacheSchema
  });
}

export function insertDatabaseMetrics(ch: Inserter) {
  return ch.insert({
    table: 'metrics.raw_database_v1',
    schema: databaseSchema
  });
}
