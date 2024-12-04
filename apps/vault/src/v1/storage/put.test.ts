import {IntegrationHarness} from '@/lib/testing';
import type {ResponseStorage} from './schema';
import {describe, it, expect} from 'vitest';

describe('Update endpoint used storage', () => {
  it('Should get 200', async context => {
    const harness = await IntegrationHarness.init(context);
    const {id} = harness.resources.endpoint;

    const response = await harness.put<ResponseStorage, ResponseStorage>({
      headers: {'content-type': 'application/json'},
      url: `/v1/storage/${id}`,
      body: {storageUsed: 100}
    });

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({});
  });

  it('Should get 404', async context => {
    const harness = await IntegrationHarness.init(context);

    const response = await harness.put<ResponseStorage, ResponseStorage>({
      headers: {'content-type': 'application/json'},
      url: '/v1/storage/enp_123456789',
      body: {storageUsed: 100}
    });

    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual({
      code: 'NOT_FOUND',
      message: 'Endpoint not found',
      docs: `${harness.env.DOCS_URL}/api-references/errors/code/NOT_FOUND`,
      requestId: response.headers['formizee-request-id']
    });
  });
});
