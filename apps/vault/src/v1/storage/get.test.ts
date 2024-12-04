import {IntegrationHarness} from '@/lib/testing';
import type {ResponseStorage} from './schema';
import {describe, it, expect} from 'vitest';

describe('Retrieve a endpoint used storage', () => {
  it('Should get 200', async context => {
    const harness = await IntegrationHarness.init(context);
    const {id} = harness.resources.endpoint;

    const response = await harness.get<ResponseStorage>({
      url: `/v1/storage/${id}`
    });

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      storageUsed: 0
    });
  });

  it('Should get 404', async context => {
    const harness = await IntegrationHarness.init(context);

    const res = await harness.get<ResponseStorage>({
      url: '/v1/storage/enp_123456789'
    });

    expect(res.status).toBe(404);
    expect(res.body).toStrictEqual({
      code: 'NOT_FOUND',
      message: 'Endpoint not found',
      docs: `${harness.env.DOCS_URL}/api-references/errors/code/NOT_FOUND`,
      requestId: res.headers['formizee-request-id']
    });
  });
});
