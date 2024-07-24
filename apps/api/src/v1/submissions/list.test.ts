import {IntegrationHarness, omit} from '@/lib/testing';
import type {ResponseSubmission} from './schema';
import {describe, it, expect} from 'vitest';
import api from '@/v1';
import {env} from '@/lib/enviroment';

describe('List submissions', () => {
  it('Should get 200', async context => {
    const harness = await IntegrationHarness.init(context, api);
    const submission = harness.resources.submission;
    const {key} = await harness.createKey();
    const {id} = harness.resources.endpoint;

    const res = await harness.get<ResponseSubmission>({
      headers: {authorization: `Bearer ${key}`},
      url: `/submissions/${id}`
    });

    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual([omit(submission, ['createdAt'])]);
  });

  it('Should get 404', async context => {
    const harness = await IntegrationHarness.init(context, api);
    const {key} = await harness.createKey();

    const res = await harness.get<ResponseSubmission>({
      headers: {authorization: `Bearer ${key}`},
      url: '/submissions/enp_notvalid'
    });

    expect(res.status).toBe(404);
    expect(res.body).toStrictEqual({
      code: 'NOT_FOUND',
      message: 'Endpoint not found',
      docs: `${env.DOCS_URL}/api-references/errors/code/NOT_FOUND`
    });
  });
});
