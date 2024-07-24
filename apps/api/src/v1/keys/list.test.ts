import {IntegrationHarness} from '@/lib/testing';
import type {ResponseKey} from './schema';
import {describe, it, expect} from 'vitest';
import api from '@/v1';

describe('List keys', () => {
  it('Should get 200', async context => {
    const harness = await IntegrationHarness.init(context, api);
    const workspaceId = harness.resources.workspace.id;
    const {key} = await harness.createKey();

    const res = await harness.get<ResponseKey>({
      headers: {authorization: `Bearer ${key}`},
      url: '/keys'
    });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject([
      {
        workspaceId,
        name: 'Example Key'
      },
      {
        workspaceId,
        name: 'Root Key'
      }
    ]);
  });
});
