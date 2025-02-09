'use server';

import {unstable_cache as cache} from 'next/cache';
import {database, count, schema} from '@/lib/db';
import {Analytics} from '@formizee/analytics';
import {env} from '@/lib/environment';

export const getStadistics = cache(
  async () => {
    const analytics = new Analytics({url: env().CLICKHOUSE_URL});

    const [{err, val: events}, endpoints, workspaces] = await Promise.all([
      await analytics.stadistics.get({}),
      await database.select({count: count()}).from(schema.endpoint),
      await database.select({count: count()}).from(schema.workspace)
    ]);

    if (err) {
      throw new Error('Clickhouse: Stadistics are not available.');
    }

    return {
      submissions: events[0]?.submissions ?? 0,
      workspaces: workspaces[0]?.count ?? 0,
      endpoints: endpoints[0]?.count ?? 0,
      requests: events[0]?.requests ?? 0
    };
  },
  ['stadistics'],
  {
    revalidate: 86400
  }
);
