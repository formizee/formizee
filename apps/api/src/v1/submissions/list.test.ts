import {IntegrationHarness, omit} from '@/lib/testing';
import type {ResponseListSubmissions} from './schema';
import {describe, it, expect} from 'vitest';

describe('List submissions', () => {
  it('Should get 200', async context => {
    const harness = await IntegrationHarness.init(context);
    const submission = harness.vaultResources.submission;
    const {key} = await harness.createKey();

    const response = await harness.get<ResponseListSubmissions>({
      headers: {authorization: `Bearer ${key}`},
      url: `/v1/submissions/${submission.endpointId}`
    });

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      _metadata: {
        itemsPerPage: 100,
        totalPages: 1,
        page: 1,
        schema: {
          email: 'string',
          name: 'string'
        }
      },
      submissions: [{...omit(submission, ['createdAt'])}]
    });
  });

  it('Should get 404 on endpoint not found', async context => {
    const harness = await IntegrationHarness.init(context);
    const {key} = await harness.createKey();

    const res = await harness.get<ResponseListSubmissions>({
      headers: {authorization: `Bearer ${key}`},
      url: '/v1/submissions/enp_123456789'
    });

    expect(res.status).toBe(404);
    expect(res.body).toStrictEqual({
      code: 'NOT_FOUND',
      docs: `${harness.docsUrl}/api-references/errors/code/NOT_FOUND`,
      requestId: res.headers['formizee-request-id'],
      message: 'Endpoint not found'
    });
  });

  it('Should get 400 with a invalid page', async context => {
    const harness = await IntegrationHarness.init(context);
    const {key} = await harness.createKey();
    const {id} = harness.resources.endpoint;

    const res = await harness.get<ResponseListSubmissions>({
      headers: {authorization: `Bearer ${key}`},
      url: `/v1/submissions/${id}?page=notvalid`
    });

    expect(res.status).toBe(400);
    expect(res.body).toStrictEqual({
      code: 'BAD_REQUEST',
      docs: `${harness.docsUrl}/api-references/errors/code/BAD_REQUEST`,
      message: "invalid_type in 'page': Expected number, received nan",
      requestId: res.headers['formizee-request-id']
    });
  });

  it('Should get 404 on not found page', async context => {
    const harness = await IntegrationHarness.init(context);
    const {id} = harness.resources.endpoint;
    const {key} = await harness.createKey();

    const res = await harness.get<ResponseListSubmissions>({
      headers: {authorization: `Bearer ${key}`},
      url: `/v1/submissions/${id}?page=999`
    });

    expect(res.status).toBe(404);
    expect(res.body).toStrictEqual({
      code: 'NOT_FOUND',
      docs: `${harness.docsUrl}/api-references/errors/code/NOT_FOUND`,
      requestId: res.headers['formizee-request-id'],
      message:
        'The requested page 999 does not exist. There are only 1 pages available'
    });
  });

  it('Should get 200 on empty endpoint', async context => {
    const harness = await IntegrationHarness.init(context);
    const {id} = harness.resources.disabledEndpoint;
    const {key} = await harness.createKey();

    const res = await harness.get<ResponseListSubmissions>({
      headers: {authorization: `Bearer ${key}`},
      url: `/v1/submissions/${id}`
    });

    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual({
      _metadata: {
        itemsPerPage: 100,
        totalPages: 1,
        page: 1,
        schema: {}
      },
      submissions: []
    });
  });
});
