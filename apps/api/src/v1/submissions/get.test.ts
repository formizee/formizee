import {IntegrationHarness} from '@/lib/testing';
import type {ResponseSubmission} from './schema';
import {describe, it, expect} from 'vitest';

describe('Get a submission', () => {
  it('Should get 200', async context => {
    const harness = await IntegrationHarness.init(context);
    const submission = harness.vaultResources.submission;
    const {key} = await harness.createKey();

    const response = await harness.get<ResponseSubmission>({
      headers: {authorization: `Bearer ${key}`},
      url: `/v1/submission/${submission.endpointId}/${submission.id}`
    });

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      data: {
        name: 'pau',
        email: 'pau@mail.com'
      },
      id: response.body.id,
      endpointId: submission.endpointId,
      location: response.body.location,
      isSpam: false,
      isRead: false
    });
  });

  it('Should get 404 on endpoint not found', async context => {
    const harness = await IntegrationHarness.init(context);
    const {key} = await harness.createKey();

    const response = await harness.get<ResponseSubmission>({
      headers: {authorization: `Bearer ${key}`},
      url: '/v1/submission/enp_123456789/sub_123456789'
    });

    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual({
      code: 'NOT_FOUND',
      docs: `${harness.docsUrl}/api-references/errors/code/NOT_FOUND`,
      requestId: response.headers['formizee-request-id'],
      message: 'Submission not found'
    });
  });
});
