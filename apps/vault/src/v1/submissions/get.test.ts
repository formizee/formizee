import {IntegrationHarness, omit} from '@/lib/testing';
import {describe, it, expect} from 'vitest';

import type {
  RequestPostSubmission,
  ResponsePostSubmission,
  ResponseSubmission
} from './schema';

describe('Retrieve a submission', () => {
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
      url: `/v1/submission/${id}/${submission.body.id}`
    });

    expect(res.body).toStrictEqual({
      ...omit(submission.body, ['pendingUploads']),
      data: {
        name: 'pau',
        email: 'pau@mail.com',
        message: 'This is an example'
      }
    });
    expect(res.status).toBe(200);
  });

  it('Should get 404', async context => {
    const harness = await IntegrationHarness.init(context);

    const res = await harness.get<ResponseSubmission>({
      headers: {Authorization: `Bearer ${harness.env.VAULT_SECRET}`},
      url: '/v1/submission/enp_123456789/sub_123456789'
    });

    expect(res.body).toStrictEqual({
      code: 'NOT_FOUND',
      message: 'Submission not found',
      docs: `${harness.env.DOCS_URL}/api-references/errors/code/NOT_FOUND`,
      requestId: res.headers['formizee-request-id']
    });
    expect(res.status).toBe(404);
  });
});
