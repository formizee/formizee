import {IntegrationHarness} from '@/lib/testing';
import type {ResponseKey} from './schema';
import {describe, it, expect} from 'vitest';

describe('List keys', () => {
  it('Should get 200', async context => {
    const harness = await IntegrationHarness.init(context);
    const workspaceId = harness.resources.workspace.id;
    const {key} = await harness.createKey();

    const res = await harness.get<ResponseKey>({
      headers: {authorization: `Bearer ${key}`},
      url: '/v1/keys'
    });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      _metadata: {
        page: 1,
        totalPages: 1,
        itemsPerPage: 100
      },
      keys: [
        {workspaceId, name: 'Example Key'},
        {workspaceId, name: 'Root Key'}
      ]
    });
  });

  it('Should get 404', async context => {
    const harness = await IntegrationHarness.init(context);
    const {key} = await harness.createKey();

    const res = await harness.get<ResponseKey>({
      headers: {authorization: `Bearer ${key}`},
      url: '/v1/keys?page=999'
    });

    expect(res.status).toBe(404);
    expect(res.body).toStrictEqual({
      code: 'NOT_FOUND',
      docs: `${harness.docsUrl}/api-references/errors/code/NOT_FOUND`,
      message:
        'The requested page 999 does not exist. There are only 1 pages available'
    });
  });

  it('Should get 400', async context => {
    const harness = await IntegrationHarness.init(context);
    const {key} = await harness.createKey();

    const res = await harness.get<ResponseKey>({
      headers: {authorization: `Bearer ${key}`},
      url: '/v1/keys?page=notvalid'
    });

    expect(res.status).toBe(400);
    expect(res.body).toStrictEqual({
      code: 'BAD_REQUEST',
      docs: `${harness.docsUrl}/api-references/errors/code/BAD_REQUEST`,
      message: "invalid_type in 'page': Expected number, received nan"
    });
  });
});
