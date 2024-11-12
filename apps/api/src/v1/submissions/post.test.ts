import type {RequestPostSubmission, ResponseSubmission} from './schema';
import {IntegrationHarness} from '@/lib/testing';
import {describe, it, expect} from 'vitest';

describe('Create a submission', () => {
  it('Should get 201 with json', async context => {
    const harness = await IntegrationHarness.init(context);
    const {id} = harness.resources.endpoint;
    const {key} = await harness.createKey();

    const res = await harness.post<RequestPostSubmission, ResponseSubmission>({
      headers: {
        authorization: `Bearer ${key}`,
        'content-type': 'application/json'
      },
      url: `/v1/submission/${id}`,
      body: {
        year: 2004,
        name: 'example',
        verified: false
      }
    });

    expect(res.body).toMatchObject({
      endpointId: id,
      data: {},
      isRead: false,
      isSpam: false
    });
    expect(res.status).toBe(201);
  });

  it('Should get 400 on empty', async context => {
    const harness = await IntegrationHarness.init(context);
    const {id} = harness.resources.endpoint;
    const {key} = await harness.createKey();

    const res = await harness.post<unknown, ResponseSubmission>({
      headers: {
        authorization: `Bearer ${key}`,
        'content-type': 'application/json'
      },
      url: `/v1/submission/${id}`,
      body: {}
    });

    expect(res.status).toBe(400);
    expect(res.body).toStrictEqual({
      code: 'BAD_REQUEST',
      message: 'The submission data is empty',
      docs: `${harness.docsUrl}/api-references/errors/code/BAD_REQUEST`
    });
  });

  it('Should get 400 on bad headers', async context => {
    const harness = await IntegrationHarness.init(context);
    const {id} = harness.resources.endpoint;
    const {key} = await harness.createKey();

    const res = await harness.post<unknown, ResponseSubmission>({
      headers: {
        authorization: `Bearer ${key}`,
        'content-type': 'application/xml'
      },
      url: `/v1/submission/${id}`,
      body: {}
    });

    expect(res.status).toBe(400);
    expect(res.body).toStrictEqual({
      code: 'BAD_REQUEST',
      message: "Use one of the supported body types: 'application/json'",
      docs: `${harness.docsUrl}/api-references/errors/code/BAD_REQUEST`
    });
  });

  it('Should get 404 on bad endpoint', async context => {
    const harness = await IntegrationHarness.init(context);
    const {key} = await harness.createKey();

    const res = await harness.post<RequestPostSubmission, ResponseSubmission>({
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${key}`
      },
      url: '/v1/submission/enp_123456789',
      body: {
        year: 2004,
        name: 'example',
        verified: false
      }
    });

    expect(res.body).toStrictEqual({
      code: 'NOT_FOUND',
      message: 'Endpoint not found',
      docs: `${harness.docsUrl}/api-references/errors/code/NOT_FOUND`
    });
    expect(res.status).toBe(404);
  });
});
