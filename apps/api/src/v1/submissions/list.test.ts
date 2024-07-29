import {IntegrationHarness, omit} from '@/lib/testing';
import type {ResponseSubmission} from './schema';
import {describe, it, expect} from 'vitest';

describe('List submissions', () => {
  it('Should get 200', async context => {
    const harness = await IntegrationHarness.init(context);
    const submission = harness.resources.submission;
    const {key} = await harness.createKey();
    const {id} = harness.resources.endpoint;

    const res = await harness.get<ResponseSubmission>({
      headers: {authorization: `Bearer ${key}`},
      url: `/v1/submissions/${id}`
    });

    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual({
      _metadata: {
        page: 1,
        totalPages: 1,
        itemsPerPage: 100
      },
      submissions: [omit(submission, ['createdAt'])]
    });
  });

  it('Should get 404 with a not found endpoint', async context => {
    const harness = await IntegrationHarness.init(context);
    const {key} = await harness.createKey();

    const res = await harness.get<ResponseSubmission>({
      headers: {authorization: `Bearer ${key}`},
      url: '/v1/submissions/enp_notvalid'
    });

    expect(res.status).toBe(404);
    expect(res.body).toStrictEqual({
      code: 'NOT_FOUND',
      message: 'Endpoint not found',
      docs: `${harness.docsUrl}/api-references/errors/code/NOT_FOUND`
    });
  });

  it('Should get 404 with a not found page', async context => {
    const harness = await IntegrationHarness.init(context);
    const {key} = await harness.createKey();
    const {id} = harness.resources.endpoint;

    const res = await harness.get<ResponseSubmission>({
      headers: {authorization: `Bearer ${key}`},
      url: `/v1/submissions/${id}?page=999`
    });

    expect(res.status).toBe(404);
    expect(res.body).toStrictEqual({
      code: 'NOT_FOUND',
      docs: `${harness.docsUrl}/api-references/errors/code/NOT_FOUND`,
      message:
        'The requested page 999 does not exist. There are only 1 pages available'
    });
  });

  it('Should get 400 with a invalid page', async context => {
    const harness = await IntegrationHarness.init(context);
    const {key} = await harness.createKey();
    const {id} = harness.resources.endpoint;

    const res = await harness.get<ResponseSubmission>({
      headers: {authorization: `Bearer ${key}`},
      url: `/v1/submissions/${id}?page=notvalid`
    });

    expect(res.status).toBe(400);
    expect(res.body).toStrictEqual({
      code: 'BAD_REQUEST',
      docs: `${harness.docsUrl}/api-references/errors/code/BAD_REQUEST`,
      message: "invalid_type in 'page': Expected number, received nan"
    });
  });
});
