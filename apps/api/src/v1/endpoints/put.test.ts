import type {RequestPutEndpoint, ResponseEndpoint} from './schema';
import {IntegrationHarness, omit} from '@/lib/testing';
import {describe, it, expect} from 'vitest';
import {env} from '@/lib/enviroment';
import api from '@/v1';

describe('Update a endpoint', () => {
  it('Should get 200 on update', async context => {
    const harness = await IntegrationHarness.init(context, api);
    const endpoint = harness.resources.endpoint;
    const {key} = await harness.createKey();

    const res = await harness.put<RequestPutEndpoint, ResponseEndpoint>({
      url: `/endpoints/${endpoint.id}`,
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

  it('Should get 403 on invalid target emails', async context => {
    const harness = await IntegrationHarness.init(context, api);
    const endpoint = harness.resources.endpoint;
    const {key} = await harness.createKey();

    const res = await harness.put<RequestPutEndpoint, ResponseEndpoint>({
      url: `/endpoints/${endpoint.id}`,
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
});
