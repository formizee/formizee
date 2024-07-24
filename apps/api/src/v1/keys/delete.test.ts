import {IntegrationHarness} from '@/lib/testing';
import type {ResponseKey} from './schema';
import {describe, it, expect} from 'vitest';
import {env} from '@/lib/enviroment';
import api from '@/v1';

describe('Delete a endpoint', () => {
  it('Should get 200', async context => {
    const harness = await IntegrationHarness.init(context, api);
    const {id} = harness.resources.key;
    const {key} = await harness.createKey();

    const res = await harness.delete<ResponseKey>({
      headers: {authorization: `Bearer ${key}`},
      url: `/key/${id}`
    });

    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual({});
  });

  it('Should get 404', async context => {
    const harness = await IntegrationHarness.init(context, api);
    const {key} = await harness.createKey();

    const res = await harness.delete<ResponseKey>({
      headers: {authorization: `Bearer ${key}`},
      url: '/key/enp_123456789'
    });

    expect(res.status).toBe(404);
    expect(res.body).toStrictEqual({
      code: 'NOT_FOUND',
      message: 'Key not found',
      docs: `${env.DOCS_URL}/api-references/errors/code/NOT_FOUND`
    });
  });
});
