import {IntegrationHarness} from '@/lib/testing';
import {test, expect} from 'vitest';

test('Should return 200', async context => {
  const harness = await IntegrationHarness.init(context);

  const result = await harness.get<Response>({
    url: '/v1/status'
  });
  expect(result.body).toStrictEqual({status: 'OK'});
});
