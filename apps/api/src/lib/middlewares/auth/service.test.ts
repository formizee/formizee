import {describe, expect, it, vi, beforeEach, afterEach} from 'vitest';
import type {ResponseEndpoint} from '@/v1/endpoints/schema';
import {IntegrationHarness, omit} from '@/lib/testing';
import {env} from '@/lib/enviroment';
import api from '@/v1';

beforeEach(async () => {
  vi.useFakeTimers();
});

afterEach(async () => {
  vi.useRealTimers();
});

describe('Authentication middleware', () => {
  it('Should return 401 without a key', async t => {
    const harness = await IntegrationHarness.init(t, api);

    const res = await harness.get<ResponseEndpoint>({
      url: '/endpoints'
    });

    expect(res.status).toBe(401);
    expect(res.body).toStrictEqual({
      code: 'UNAUTHORIZED',
      message: 'API key required',
      docs: `${env.DOCS_URL}/api-references/errors/code/UNAUTHORIZED`
    });
  });

  it('Should return 200 with a key', async t => {
    const harness = await IntegrationHarness.init(t, api);
    const endpoint = harness.resources.endpoint;
    const {key} = await harness.createKey();

    const res = await harness.get<ResponseEndpoint>({
      headers: {authorization: `Bearer ${key}`},
      url: `/endpoint/${endpoint.id}`
    });

    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual(omit(endpoint, ['createdAt', 'updatedAt']));
  });

  it('Should return 401 with a invalid key', async t => {
    const harness = await IntegrationHarness.init(t, api);

    const res = await harness.get<ResponseEndpoint>({
      headers: {authorization: 'Bearer fz_invalid_key'},
      url: '/endpoints'
    });

    expect(res.status).toBe(401);
    expect(res.body).toStrictEqual({
      code: 'UNAUTHORIZED',
      message: 'The API key is not valid',
      docs: `${env.DOCS_URL}/api-references/errors/code/UNAUTHORIZED`
    });
  });

  it('Should return 401 with a expired key', async t => {
    const harness = await IntegrationHarness.init(t, api);
    const {key} = await harness.createKey();

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    vi.setSystemTime(expiresAt);

    const res = await harness.get<ResponseEndpoint>({
      headers: {authorization: `Bearer ${key}`},
      url: '/endpoints'
    });

    expect(res.status).toBe(401);
    expect(res.body).toStrictEqual({
      code: 'UNAUTHORIZED',
      message: 'The API key is expired',
      docs: `${env.DOCS_URL}/api-references/errors/code/UNAUTHORIZED`
    });
  });
});
