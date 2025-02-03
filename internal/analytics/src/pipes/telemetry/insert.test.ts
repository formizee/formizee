import {ClickHouseContainer} from '@/testutils';
import {expect, test} from 'vitest';
import {newId} from '@formizee/id';
import {Analytics} from '@/index';

test(
  'inserts a single telemetry log',
  {
    timeout: 300_000
  },
  async t => {
    const container = await ClickHouseContainer.start(t);

    const analytics = new Analytics({url: container.url()});

    const telemetry = {
      request_id: newId('request'),
      time: Date.now(),
      runtime: 'node@20',
      platform: 'vercel',
      versions: ['@formizee/api@1.2.3']
    };

    const request = await analytics.telemetry.insert(telemetry);
    expect(request.val?.executed).toBe(true);
    expect(request.err).toBeUndefined();
  }
);
