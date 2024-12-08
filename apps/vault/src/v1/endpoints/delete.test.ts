import {IntegrationHarness} from '@/lib/testing';
import {describe, it, expect} from 'vitest';

describe('Delete a endpoint', () => {
  it('Should get 200', async context => {
    const harness = await IntegrationHarness.init(context);
    const {id} = harness.resources.endpoint;

    const res = await harness.delete<Response>({
      headers: {Authorization: `Bearer ${harness.env.VAULT_SECRET}`},
      url: `/v1/endpoint/${id}`
    });

    expect(res.body).toStrictEqual({});
    expect(res.status).toBe(200);
  });

  it('Should get 404', async context => {
    const harness = await IntegrationHarness.init(context);

    const res = await harness.delete<Response>({
      headers: {Authorization: `Bearer ${harness.env.VAULT_SECRET}`},
      url: '/v1/endpoint/enp_123456789'
    });

    expect(res.body).toStrictEqual({
      code: 'NOT_FOUND',
      message: 'Endpoint not found',
      docs: `${harness.env.DOCS_URL}/api-references/errors/code/NOT_FOUND`,
      requestId: res.headers['formizee-request-id']
    });
    expect(res.status).toBe(404);
  });
});
