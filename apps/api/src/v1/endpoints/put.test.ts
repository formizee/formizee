import type {RequestPutEndpoint, ResponseEndpoint} from './schema';
import {IntegrationHarness, omit} from '@/lib/testing';
import {describe, it, expect} from 'vitest';

describe('Update a endpoint', () => {
  it('Should get 200 on update', async context => {
    const harness = await IntegrationHarness.init(context);
    const endpoint = harness.resources.endpoint;
    const {key} = await harness.createKey();

    const res = await harness.put<RequestPutEndpoint, ResponseEndpoint>({
      url: `/v1/endpoint/${endpoint.id}`,
      headers: {
        authorization: `Bearer ${key}`,
        'content-type': 'application/json'
      },
      body: {
        icon: 'sun',
        color: 'red',
        isEnabled: false,
        emailNotifications: false
      }
    });

    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual({
      ...omit(endpoint, ['createdAt', 'updatedAt']),
      icon: 'sun',
      color: 'red',
      isEnabled: false,
      emailNotifications: false
    });
  });

  it('Should get 400 on empty update', async context => {
    const harness = await IntegrationHarness.init(context);
    const endpoint = harness.resources.endpoint;
    const {key} = await harness.createKey();

    const res = await harness.put<unknown, ResponseEndpoint>({
      headers: {
        authorization: `Bearer ${key}`,
        'content-type': 'application/json'
      },
      url: `/v1/endpoint/${endpoint.id}`,
      body: {}
    });

    expect(res.status).toBe(400);
    expect(res.body).toStrictEqual({
      code: 'BAD_REQUEST',
      message: "There's no fields to update",
      docs: `${harness.docsUrl}/api-references/errors/code/BAD_REQUEST`,
      requestId: res.headers['formizee-request-id']
    });
  });

  it('Should get 403 on invalid target emails', async context => {
    const harness = await IntegrationHarness.init(context);
    const endpoint = harness.resources.endpoint;
    const {key} = await harness.createKey();

    const res = await harness.put<RequestPutEndpoint, ResponseEndpoint>({
      url: `/v1/endpoint/${endpoint.id}`,
      headers: {
        authorization: `Bearer ${key}`,
        'content-type': 'application/json'
      },
      body: {
        slug: 'my-example',
        targetEmails: ['another@formizee.com']
      }
    });

    expect(res.status).toBe(403);
    expect(res.body).toStrictEqual({
      code: 'FORBIDDEN',
      message:
        'All the target emails needs to be available in the current workspace',
      docs: `${harness.docsUrl}/api-references/errors/code/FORBIDDEN`,
      requestId: res.headers['formizee-request-id']
    });
  });
});
