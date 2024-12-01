import {IntegrationHarness} from '@/lib/testing';
import type {ResponseEndpoint} from './schema';
import {describe, it, expect} from 'vitest';

describe('Delete a endpoint', () => {
  it('Should get 200', async context => {
    const harness = await IntegrationHarness.init(context);
    const endpoint = harness.resources.endpoint;
    const {key} = await harness.createKey();

    const res = await harness.delete<ResponseEndpoint>({
      headers: {authorization: `Bearer ${key}`},
      url: `/v1/endpoint/${endpoint.id}`
    });

    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual({});
  });

  it('Should get 404', async context => {
    const harness = await IntegrationHarness.init(context);
    const {key} = await harness.createKey();

    const res = await harness.delete<ResponseEndpoint>({
      headers: {authorization: `Bearer ${key}`},
      url: '/v1/endpoint/enp_123456789'
    });

    expect(res.status).toBe(404);
    expect(res.body).toStrictEqual({
      code: 'NOT_FOUND',
      message: 'Endpoint not found',
      docs: `${harness.docsUrl}/api-references/errors/code/NOT_FOUND`,
      requestId: res.headers['formizee-request-id']
    });
  });
});
