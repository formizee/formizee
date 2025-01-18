'use server';

import {unstable_cache as cache} from 'next/cache';
import {database, count, schema} from '@/lib/db';
import {Analytics} from '@formizee/analytics';
import {env} from '@/lib/environment';

export const getStadistics = cache(
  async () => {
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
      submissions: events.submissions,
      workspaces: workspaces[0]?.count ?? 0,
      endpoints: endpoints[0]?.count ?? 0,
      requests: events.requests
    };
  },
  ['stadistics'],
  {
    revalidate: 86400
  }
);
