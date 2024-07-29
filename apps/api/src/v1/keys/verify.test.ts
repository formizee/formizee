import type {RequestVerifyKey, ResponseKey} from './schema';
import {IntegrationHarness} from '@/lib/testing';
import {describe, it, expect} from 'vitest';

describe('Verify a key', () => {
  it('Should get 200', async context => {
    const harness = await IntegrationHarness.init(context);
    const workspaceId = harness.resources.workspace.id;
    const {id, key} = await harness.createKey();

    const res = await harness.post<RequestVerifyKey, ResponseKey>({
      url: '/v1/key/verify',
      headers: {
        authorization: `Bearer ${key}`,
        'content-type': 'application/json'
      },
      body: {key}
    });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id,
      workspaceId,
      name: 'Root Key'
    });
  });

  it('Should get 401 if not valid', async context => {
    const harness = await IntegrationHarness.init(context);
    const {key} = await harness.createKey();

    const res = await harness.post<RequestVerifyKey, ResponseKey>({
      url: '/v1/key/verify',
      headers: {
        authorization: 'Bearer fz_notvalidkey',
        'content-type': 'application/json'
      },
      body: {key}
    });

    expect(res.status).toBe(401);
    expect(res.body).toStrictEqual({
      code: 'UNAUTHORIZED',
      message: 'The API key is not valid',
      docs: `${harness.docsUrl}/api-references/errors/code/UNAUTHORIZED`
    });
  });
});
