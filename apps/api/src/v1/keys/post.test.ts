import type {RequestPostKey, ResponseKey} from './schema';
import {IntegrationHarness} from '@/lib/testing';
import {describe, it, expect} from 'vitest';

describe('Create a key', () => {
  it('Should get 201', async context => {
    const harness = await IntegrationHarness.init(context);
    const workspaceId = harness.resources.workspace.id;
    const {key} = await harness.createKey();

    const res = await harness.post<RequestPostKey, ResponseKey>({
      url: '/v1/key',
      headers: {
        authorization: `Bearer ${key}`,
        'content-type': 'application/json'
      },
      body: {
        name: 'my-key',
        expiresAt: '1-day'
      }
    });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      name: 'my-key',
      workspaceId
    });
  });
});
