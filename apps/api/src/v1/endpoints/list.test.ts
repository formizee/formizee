import {IntegrationHarness, omit} from '@/lib/testing';
import type {ResponseEndpoint} from './schema';
import {describe, it, expect} from 'vitest';
import api from '@/v1';

describe('List endpoints', () => {
  it('Should get 200', async context => {
    const harness = await IntegrationHarness.init(context, api);
    const endpoint = harness.resources.endpoint;
    const {key} = await harness.createKey();

    const res = await harness.get<ResponseEndpoint>({
      headers: {authorization: `Bearer ${key}`},
      url: '/endpoints'
    });

    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual([
      omit(endpoint, ['createdAt', 'updatedAt'])
    ]);
  });
});
