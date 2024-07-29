import {IntegrationHarness, omit} from '@/lib/testing';
import type {ResponseSubmission} from './schema';
import {describe, it, expect} from 'vitest';

describe('Retrieve a submission', () => {
  it('Should get 200', async context => {
    const harness = await IntegrationHarness.init(context);
    const submission = harness.resources.submission;
    const {key} = await harness.createKey();

    const res = await harness.get<ResponseSubmission>({
      headers: {authorization: `Bearer ${key}`},
      url: `/v1/submission/${submission.id}`
    });

    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual(omit(submission, ['createdAt']));
  });

  it('Should get 404', async context => {
    const harness = await IntegrationHarness.init(context);
    const {key} = await harness.createKey();

    const res = await harness.get<ResponseSubmission>({
      headers: {authorization: `Bearer ${key}`},
      url: '/v1/submission/sub_123456789'
    });

    expect(res.status).toBe(404);
    expect(res.body).toStrictEqual({
      code: 'NOT_FOUND',
      message: 'Submission not found',
      docs: `${harness.docsUrl}/api-references/errors/code/NOT_FOUND`
    });
  });
});
