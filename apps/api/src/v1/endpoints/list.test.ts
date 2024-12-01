import {IntegrationHarness, omit} from '@/lib/testing';
import type {ResponseEndpoint} from './schema';
import {describe, it, expect} from 'vitest';

describe('List endpoints', () => {
  it('Should get 200', async context => {
    const harness = await IntegrationHarness.init(context);
    const disabledEndpoint = harness.resources.disabledEndpoint;
    const endpoint = harness.resources.endpoint;

    const {key} = await harness.createKey();

    const res = await harness.get<ResponseEndpoint>({
      headers: {authorization: `Bearer ${key}`},
      url: '/v1/endpoints'
    });

    expect(res.body).toStrictEqual({
      _metadata: {
        page: 1,
        totalPages: 1,
        itemsPerPage: 100
      },
      endpoints: [
        omit(endpoint, ['createdAt', 'updatedAt']),
        omit(disabledEndpoint, ['createdAt', 'updatedAt'])
      ]
    });
    expect(res.status).toBe(200);
  });

  it('Should get 404', async context => {
    const harness = await IntegrationHarness.init(context);
    const {key} = await harness.createKey();

    const res = await harness.get<ResponseEndpoint>({
      headers: {authorization: `Bearer ${key}`},
      url: '/v1/endpoints?page=999'
    });

    expect(res.status).toBe(404);
    expect(res.body).toStrictEqual({
      code: 'NOT_FOUND',
      docs: `${harness.docsUrl}/api-references/errors/code/NOT_FOUND`,
      message:
        'The requested page 999 does not exist. There are only 1 pages available',
      requestId: res.headers['formizee-request-id']
    });
  });

  it('Should get 400', async context => {
    const harness = await IntegrationHarness.init(context);
    const {key} = await harness.createKey();

    const res = await harness.get<ResponseEndpoint>({
      headers: {authorization: `Bearer ${key}`},
      url: '/v1/endpoints?page=notvalid'
    });

    expect(res.status).toBe(400);
    expect(res.body).toStrictEqual({
      code: 'BAD_REQUEST',
      docs: `${harness.docsUrl}/api-references/errors/code/BAD_REQUEST`,
      message: "invalid_type in 'page': Expected number, received nan",
      requestId: res.headers['formizee-request-id']
    });
  });
});
