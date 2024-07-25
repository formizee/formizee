import type {RequestPutKey, ResponseKey} from './schema';
import {IntegrationHarness} from '@/lib/testing';
import {describe, it, expect} from 'vitest';
import {env} from '@/lib/enviroment';
import api from '@/v1';

describe('Update a key', () => {
  it('Should get 200 on update', async context => {
    const harness = await IntegrationHarness.init(context, api);
    const exampleKey = harness.resources.key;
    const {key} = await harness.createKey();

    const res = await harness.put<RequestPutKey, ResponseKey>({
      url: `/key/${exampleKey.id}`,
      headers: {
        authorization: `Bearer ${key}`,
        'content-type': 'application/json'
      },
      body: {
        name: 'My Updated Key',
        expiresAt: '7-days'
      }
    });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: exampleKey.id,
      name: 'My Updated Key',
      workspaceId: exampleKey.workspaceId
    });
  });

  it('Should get 400 on empty update', async context => {
    const harness = await IntegrationHarness.init(context, api);
    const {key} = await harness.createKey();
    const {id} = harness.resources.key;

    const res = await harness.put<unknown, ResponseKey>({
      headers: {
        authorization: `Bearer ${key}`,
        'content-type': 'application/json'
      },
      url: `/key/${id}`,
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

    const res = await harness.put<RequestPutKey, ResponseKey>({
      url: '/key/fz_notvalidkey',
      headers: {
        authorization: `Bearer ${key}`,
        'content-type': 'application/json'
      },
      body: {
        name: 'My Updated Key',
        expiresAt: '7-days'
      }
    });

    expect(res.status).toBe(404);
    expect(res.body).toStrictEqual({
      code: 'NOT_FOUND',
      message: 'Key not found',
      docs: `${env.DOCS_URL}/api-references/errors/code/NOT_FOUND`
    });
  });
});