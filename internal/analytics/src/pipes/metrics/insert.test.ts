import {ClickHouseContainer} from '../../testutils';
import {expect, test} from 'vitest';
import {Analytics} from '../../index';

test(
  'inserts a single cache metric',
  {
    timeout: 300_000
  },
  async t => {
    const container = await ClickHouseContainer.start(t);

    const analytics = new Analytics({url: container.url()});

    const res = await analytics.metrics.insertCache({
      key: 'example',
      type: 'read',
      latency: 10,
      hit: true
    });

    expect(res.val?.executed).toBe(true);
    expect(res.err).toBeUndefined();
  }
);

test(
  'inserts a single database metric',
  {
    timeout: 300_000
  },
  async t => {
    const container = await ClickHouseContainer.start(t);

    const analytics = new Analytics({url: container.url()});

    const res = await analytics.metrics.insertDatabase({
      query: 'users.get',
      type: 'read',
      latency: 10
    });

    expect(res.val?.executed).toBe(true);
    expect(res.err).toBeUndefined();
  }
);
