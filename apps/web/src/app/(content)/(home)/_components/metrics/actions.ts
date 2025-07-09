'use server';

import {unstable_cache as cache} from 'next/cache';
import {database, count, schema} from '@/lib/db';
import {Analytics} from '@formizee/analytics';
import {env} from '@/lib/environment';

export const getStadistics = cache(
  async () => {
    if (env().VERCEL_ENV === 'development') {
      return {
        submissions: 1234,
        requests: 12345,
        workspaces: 123,
        endpoints: 123
      };
    }

    const analytics = new Analytics({
      tinybirdUrl: env().TINYBIRD_URL,
      tinybirdToken: env().TINYBIRD_TOKEN
    });

    const [events, endpoints, workspaces] = await Promise.all([
      await analytics.queryFormizeeStadistics(),
      await database.select({count: count()}).from(schema.endpoint),
      await database.select({count: count()}).from(schema.workspace)
    ]);

    return {
      workspaces: workspaces[0]?.count ?? 0,
      submissions: events.submissions ?? 0,
      endpoints: endpoints[0]?.count ?? 0,
      requests: events.requests ?? 0
    };
  },
  ['stadistics'],
  {
    revalidate: 86400
  }
);
