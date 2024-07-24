import {IntegrationHarness, omit} from '@/lib/testing';
import type {ResponseEndpoint} from './schema';
import {describe, it, expect} from 'vitest';
import {env} from '@/lib/enviroment';
import api from '@/v1';

describe('Retrieve a endpoint', () => {
  it('Should get 200', async context => {
    const harness = await IntegrationHarness.init(context, api);
    const endpoint = harness.resources.endpoint;
    const {key} = await harness.createKey();

    const res = await harness.get<ResponseEndpoint>({
      headers: {authorization: `Bearer ${key}`},
      url: `/endpoints/${endpoint.id}`
    });

    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual(omit(endpoint, ['createdAt', 'updatedAt']));
  });

  it('Should get 404', async context => {
    const harness = await IntegrationHarness.init(context, api);
    const {key} = await harness.createKey();

    const res = await harness.get<ResponseEndpoint>({
      headers: {authorization: `Bearer ${key}`},
      url: '/endpoints/enp_123456789'
    });

    expect(res.status).toBe(404);
    expect(res.body).toStrictEqual({
      code: 'NOT_FOUND',
      message: 'Endpoint not found.',
      docs: `${env.DOCS_URL}/api-references/errors/code/NOT_FOUND`
    });
  });
});
