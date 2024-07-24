import type {RequestPutSubmission, ResponseSubmission} from './schema';
import {IntegrationHarness, omit} from '@/lib/testing';
import {describe, it, expect} from 'vitest';
import {env} from '@/lib/enviroment';
import api from '@/v1';

describe('Update a submission', () => {
  it('Should get 200', async context => {
    const harness = await IntegrationHarness.init(context, api);
    const submission = harness.resources.submission;
    const {key} = await harness.createKey();

    const res = await harness.put<RequestPutSubmission, ResponseSubmission>({
      headers: {
        authorization: `Bearer ${key}`,
        'content-type': 'application/json'
      },
      url: `/submission/${submission.id}`,
      body: {
        isSpam: true,
        isRead: true
      }
    });

    expect(res.body).toStrictEqual({
      ...omit(submission, ['createdAt']),
      isRead: true,
      isSpam: true
    });
    expect(res.status).toBe(200);
  });

  it('Should get 400', async context => {
    const harness = await IntegrationHarness.init(context, api);
    const submission = harness.resources.submission;
    const {key} = await harness.createKey();

    const res = await harness.put<unknown, ResponseSubmission>({
      headers: {
        authorization: `Bearer ${key}`,
        'content-type': 'application/json'
      },
      url: `/submission/${submission.id}`,
      body: {}
    });

    expect(res.status).toBe(400);
    expect(res.body).toStrictEqual({
      code: 'BAD_REQUEST',
      message: "There's no fields to update",
      docs: `${env.DOCS_URL}/api-references/errors/code/BAD_REQUEST`
    });
  });

  it('Should get 404', async context => {
    const harness = await IntegrationHarness.init(context, api);
    const {key} = await harness.createKey();

    const res = await harness.get<ResponseSubmission>({
      headers: {authorization: `Bearer ${key}`},
      url: '/submission/sub_123456789'
    });

    expect(res.status).toBe(404);
    expect(res.body).toStrictEqual({
      code: 'NOT_FOUND',
      message: 'Submission not found',
      docs: `${env.DOCS_URL}/api-references/errors/code/NOT_FOUND`
    });
  });
});
