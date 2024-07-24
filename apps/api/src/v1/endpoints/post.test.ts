import type {RequestPostEndpoint, ResponseEndpoint} from './schema';
import {IntegrationHarness} from '@/lib/testing';
import {describe, it, expect} from 'vitest';
import {env} from '@/lib/enviroment';
import api from '@/v1';

describe('Create a endpoint', () => {
  it('Should get 201 on post', async context => {
    const harness = await IntegrationHarness.init(context, api);
    const workspaceId = harness.resources.workspace.id;
    const {key} = await harness.createKey();

    const res = await harness.post<RequestPostEndpoint, ResponseEndpoint>({
      url: '/endpoint',
      headers: {
        authorization: `Bearer ${key}`,
        'content-type': 'application/json'
      },
      body: {
        slug: 'my-example',
        targetEmails: ['user@formizee.com']
      }
    });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      workspaceId,
      slug: 'my-example',
      isEnabled: true,
      emailNotifications: true,
      redirectUrl: `${env.WEB_URL}/thanks-you`,
      targetEmails: ['user@formizee.com'],
      icon: 'file',
      color: 'gray'
    });
  });

  it('Should get 403 on invalid target emails', async context => {
    const harness = await IntegrationHarness.init(context, api);
    const {key} = await harness.createKey();

    const res = await harness.post<RequestPostEndpoint, ResponseEndpoint>({
      url: '/endpoint',
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
      docs: `${env.DOCS_URL}/api-references/errors/code/FORBIDDEN`
    });
  });

  it('Should get 409 on already taken slug', async context => {
    const harness = await IntegrationHarness.init(context, api);
    const {key} = await harness.createKey();

    const res = await harness.post<RequestPostEndpoint, ResponseEndpoint>({
      url: '/endpoint',
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
      docs: `${env.DOCS_URL}/api-references/errors/code/METHOD_NOT_ALLOWED`
    });
  });
});
