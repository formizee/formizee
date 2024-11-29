import {IntegrationHarness} from '@/lib/testing';
import {describe, it, expect} from 'vitest';

import type {
  RequestPostSubmission,
  ResponsePostSubmission,
  ResponseSubmission
} from './schema';

describe('Delete a submission', () => {
  it('Should get 200', async context => {
    const harness = await IntegrationHarness.init(context);
    const {id} = harness.resources.endpoint;

    const submission = await harness.post<
      RequestPostSubmission,
      ResponsePostSubmission
    >({
      headers: {
        'content-type': 'application/json'
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

    const res = await harness.delete<ResponseSubmission>({
      url: `/v1/submission/${id}/${submission.body.id}`
    });

    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual({});
  });

  it('Should get 404', async context => {
    const harness = await IntegrationHarness.init(context);

    const res = await harness.get<ResponseSubmission>({
      url: '/v1/submission/enp_123456789/sub_123456789'
    });

    expect(res.status).toBe(404);
    expect(res.body).toStrictEqual({
      code: 'NOT_FOUND',
      message: 'Submission not found',
      docs: `${harness.env.DOCS_URL}/api-references/errors/code/NOT_FOUND`
    });
  });
});