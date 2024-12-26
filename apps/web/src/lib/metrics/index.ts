import {count, database, schema} from '@/lib/db';
import {Analytics} from '@formizee/analytics';
import {unstable_cache} from 'next/cache';
import {env} from '@/lib/environment';

async function getData() {
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
}

export const getMetrics = unstable_cache(
  async () => await getData(),
  ['stadistics'],
  {
    revalidate: 84600
  }
);
