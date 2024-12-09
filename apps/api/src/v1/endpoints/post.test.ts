import type {RequestPostEndpoint, ResponseEndpoint} from './schema';
import {IntegrationHarness} from '@/lib/testing';
import {describe, it, expect} from 'vitest';

describe('Create a endpoint', () => {
  it('Should get 201 on post', async context => {
    const harness = await IntegrationHarness.init(context);
    const workspaceId = harness.resources.workspace.id;
    const user = harness.resources.user;
    const {key} = await harness.createKey();

    const res = await harness.post<RequestPostEndpoint, ResponseEndpoint>({
      url: '/v1/endpoint',
      headers: {
        authorization: `Bearer ${key}`,
        'content-type': 'application/json'
      },
      body: {
        slug: 'my-example',
        targetEmails: [user.email]
      }
    });

    expect(res.body).toMatchObject({
      workspaceId,
      name: 'my-example',
      slug: 'my-example',
      isEnabled: true,
      emailNotifications: true,
      redirectUrl: `${harness.webUrl}/thanks-you`,
      targetEmails: [user.email],
      icon: 'file',
      color: 'gray'
    });
    expect(res.status).toBe(201);
  });

  it('Should get 403 on invalid target emails', async context => {
    const harness = await IntegrationHarness.init(context);
    const {key} = await harness.createKey();

    const res = await harness.post<RequestPostEndpoint, ResponseEndpoint>({
      url: '/v1/endpoint',
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
      requestId: res.headers['formizee-request-id'],
      message:
        'All the target emails needs to be available in the current workspace',
      docs: `${harness.docsUrl}/api-references/errors/code/FORBIDDEN`
    });
  });

  it('Should get 409 on already taken slug', async context => {
    const harness = await IntegrationHarness.init(context);
    const {key} = await harness.createKey();

    const res = await harness.post<RequestPostEndpoint, ResponseEndpoint>({
      url: '/v1/endpoint',
      headers: {
        authorization: `Bearer ${key}`,
        'content-type': 'application/json'
      },
      body: {
        slug: 'my-endpoint',
        targetEmails: ['user@formizee.com']
      }
    });

    expect(res.status).toBe(409);
    expect(res.body).toStrictEqual({
      code: 'METHOD_NOT_ALLOWED',
      message: 'Slug has to be unique and has already been taken',
      docs: `${harness.docsUrl}/api-references/errors/code/METHOD_NOT_ALLOWED`,
      requestId: res.headers['formizee-request-id']
    });
  });
});
