import type {RequestPostSubmission, ResponseSubmission} from './schema';
import {IntegrationHarness} from '@/lib/testing';
import {describe, it, expect} from 'vitest';

describe('Post a submission with json', () => {
  it('Should get 201', async context => {
    const harness = await IntegrationHarness.init(context);
    const endpoint = harness.resources.endpoint;
    const {key} = await harness.createKey();

    const response = await harness.post<
      RequestPostSubmission,
      ResponseSubmission
    >({
      url: `/v1/submission/${endpoint.id}`,
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${key}`
      },
      body: {
        name: 'pau',
        email: 'pau@mail.com'
      }
    });

    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual({
      data: {
        name: 'pau',
        email: 'pau@mail.com'
      },
      id: response.body.id,
      endpointId: endpoint.id,
      location: response.body.location,
      isSpam: false,
      isRead: false
    });
  });

  it('Should get 403 on disabled endpoint', async context => {
    const harness = await IntegrationHarness.init(context);
    const endpoint = harness.resources.disabledEndpoint;
    const {key} = await harness.createKey();

    const response = await harness.post<
      RequestPostSubmission,
      ResponseSubmission
    >({
      url: `/v1/submission/${endpoint.id}`,
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${key}`
      },
      body: {
        name: 'pau',
        email: 'pau@mail.com'
      }
    });

    expect(response.status).toBe(403);
    expect(response.body).toStrictEqual({
      code: 'FORBIDDEN',
      docs: `${harness.docsUrl}/api-references/errors/code/FORBIDDEN`,
      requestId: response.headers['formizee-request-id'],
      message: 'The endpoint is currently not accepting submissions'
    });
  });

  it('Should get 400 on empty submission', async context => {
    const harness = await IntegrationHarness.init(context);
    const endpoint = harness.resources.endpoint;
    const {key} = await harness.createKey();

    const response = await harness.post<
      RequestPostSubmission,
      ResponseSubmission
    >({
      url: `/v1/submission/${endpoint.id}`,
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${key}`
      },
      body: {}
    });

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      code: 'BAD_REQUEST',
      docs: `${harness.docsUrl}/api-references/errors/code/BAD_REQUEST`,
      requestId: response.headers['formizee-request-id'],
      message: 'The submission is empty'
    });
  });

  it('Should get 404 on endpoint not found', async context => {
    const harness = await IntegrationHarness.init(context);
    const {key} = await harness.createKey();

    const response = await harness.post<
      RequestPostSubmission,
      ResponseSubmission
    >({
      url: '/v1/submission/enp_123456789',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${key}`
      },
      body: {
        name: 'pau',
        email: 'pau@mail.com'
      }
    });

    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual({
      code: 'NOT_FOUND',
      docs: `${harness.docsUrl}/api-references/errors/code/NOT_FOUND`,
      requestId: response.headers['formizee-request-id'],
      message: 'Endpoint not found'
    });
  });
});
