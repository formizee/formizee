import {IntegrationHarness} from '@/lib/testing';
import type {ResponseKey} from './schema';
import {describe, it, expect} from 'vitest';

describe.skip('Delete a key', () => {
  it('Should get 200', async context => {
    const harness = await IntegrationHarness.init(context);
    const {id} = harness.resources.key;
    const {key} = await harness.createKey();

    const res = await harness.delete<ResponseKey>({
      headers: {authorization: `Bearer ${key}`},
      url: `/v1/key/${id}`
    });

    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual({});
  });

  it('Should get 404', async context => {
    const harness = await IntegrationHarness.init(context);
    const {key} = await harness.createKey();

    const res = await harness.delete<ResponseKey>({
      headers: {authorization: `Bearer ${key}`},
      url: '/v1/key/enp_123456789'
    });

    expect(res.status).toBe(404);
    expect(res.body).toStrictEqual({
      code: 'NOT_FOUND',
      message: 'Key not found',
      docs: `${harness.docsUrl}/api-references/errors/code/NOT_FOUND`
    });
  });
});
