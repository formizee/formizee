import {IntegrationHarness, omit} from '@/lib/testing';
import type {
  RequestPostSubmission,
  ResponsePostSubmission,
  ResponseSubmission
} from './schema';
import {describe, it, expect} from 'vitest';

describe('List submissions', () => {
  it('Should get 200', async context => {
    const harness = await IntegrationHarness.init(context);
    const {id} = harness.resources.endpoint;

    const submission = await harness.post<
      RequestPostSubmission,
      ResponsePostSubmission
    >({
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${harness.env.VAULT_SECRET}`
      },
      url: '/v1/submission',
      body: {
        endpointId: id,
        data: {
          name: 'pau',
          email: 'pau@mail.com',
          message: 'This is an example'
        },
        fileUploads: [],
        location: '0.0.0.0'
      }
    });

    const res = await harness.get<ResponseSubmission>({
      headers: {Authorization: `Bearer ${harness.env.VAULT_SECRET}`},
      url: `/v1/submissions/${id}`
    });
    const createdAt = new Date(submission.body.createdAt);
    createdAt.setMilliseconds(0);

    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual({
      _metadata: {
        page: 1,
        totalPages: 1,
        itemsPerPage: 100,
        schema: {
          name: 'string',
          email: 'string',
          message: 'string'
        }
      },
      submissions: [
        {
          ...omit(submission.body, ['pendingUploads']),
          createdAt: createdAt.toISOString(),
          data: {
            name: 'pau',
            email: 'pau@mail.com',
            message: 'This is an example'
          }
        }
      ]
    });
  });

  it('Should get 200 with no submissions', async context => {
    const harness = await IntegrationHarness.init(context);
    const {id} = harness.resources.endpoint;

    const res = await harness.get<ResponseSubmission>({
      headers: {Authorization: `Bearer ${harness.env.VAULT_SECRET}`},
      url: `/v1/submissions/${id}`
    });

    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual({
      _metadata: {
        page: 1,
        totalPages: 1,
        itemsPerPage: 100,
        schema: {
          name: 'string',
          email: 'string',
          message: 'string'
        }
      },
      submissions: []
    });
  });

  it('Should get 404 with a not found page', async context => {
    const harness = await IntegrationHarness.init(context);
    const {id} = harness.resources.endpoint;

    const res = await harness.get<ResponseSubmission>({
      headers: {Authorization: `Bearer ${harness.env.VAULT_SECRET}`},
      url: `/v1/submissions/${id}?page=999`
    });

    expect(res.status).toBe(404);
    expect(res.body).toStrictEqual({
      code: 'NOT_FOUND',
      docs: `${harness.env.DOCS_URL}/api-references/errors/code/NOT_FOUND`,
      message:
        'The requested page 999 does not exist. There are only 1 pages available',
      requestId: res.headers['formizee-request-id']
    });
  });

  it('Should get 400 with a invalid page', async context => {
    const harness = await IntegrationHarness.init(context);
    const {id} = harness.resources.endpoint;

    const res = await harness.get<ResponseSubmission>({
      headers: {Authorization: `Bearer ${harness.env.VAULT_SECRET}`},
      url: `/v1/submissions/${id}?page=notvalid`
    });

    expect(res.status).toBe(400);
    expect(res.body).toStrictEqual({
      code: 'BAD_REQUEST',
      docs: `${harness.env.DOCS_URL}/api-references/errors/code/BAD_REQUEST`,
      message: "invalid_type in 'page': Expected number, received nan",
      requestId: res.headers['formizee-request-id']
    });
  });
});
