import {ClickHouseContainer} from '@/testutils';
import {randomUUID} from 'node:crypto';
import {expect, test} from 'vitest';
import {newId} from '@formizee/id';
import {Analytics} from '@/index';

test(
  'inserts a single request',
  {
    timeout: 300_000
  },
  async t => {
    const container = await ClickHouseContainer.start(t);

    const analytics = new Analytics({url: container.url()});

    const request = {
      request_id: newId('request'),
      time: Date.now(),
      workspace_id: newId('request'),
      host: 'api.formizee.com',
      method: 'GET',
      path: '/v1/status',
      request_headers: ['content-type: application/json'],
      request_body: JSON.stringify({data: randomUUID()}),
      response_status: 200,
      response_headers: ['content-type: application/json'],
      response_body: JSON.stringify({status: 'success', id: randomUUID()}),
      error: Math.random() < 0.1 ? 'Internal server error' : '',
      service_latency: Math.floor(Math.random() * 1000),
      user_agent: 'Mozilla/5.0 (compatible; Bot/1.0)',
      ip_address: `${Math.floor(Math.random() * 256)}.${Math.floor(
        Math.random() * 256
      )}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`
    };

    const {err: insertErr} = await analytics.api.insert(request);
    expect(insertErr).toBeUndefined();

    const billableApiRequests = await analytics.billing.billableApiRequests({
      workspaceId: request.workspace_id,
      startDate: request.time,
      endDate: Date.now()
    });

    expect(billableApiRequests.err).toBeUndefined();
    expect(billableApiRequests.val).toStrictEqual([{requests: 1}]);
  }
);
