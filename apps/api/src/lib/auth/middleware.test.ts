import {expect, test, vi, beforeEach, afterEach} from 'vitest';
import {IntegrationHarness} from '@/lib/testing';
import api from '@/v1';

beforeEach(async () => {
  vi.useFakeTimers();
});

afterEach(async () => {
  vi.useRealTimers();
});

test('Should return 401 without a key', async t => {
  await IntegrationHarness.init(t);
  const res = await api.request('/endpoints', {});

  expect(res.status).toBe(401);
  expect(await res.text()).toBe('API key required.');
});

test('Should return 200 with a key', async t => {
  const helper = await IntegrationHarness.init(t);
  const {key} = await helper.createKey();
  const res = await api.request('/endpoints', {
    headers: {Authorization: `Bearer ${key}`}
  });

  const data = await res.json();
  expect(res.status).toBe(200);
  expect(data.length).toBeGreaterThan(0);
});

test('Should return 401 with a invalid key', async t => {
  await IntegrationHarness.init(t);
  const res = await api.request('/endpoints', {
    headers: {Authorization: 'Bearer fz_invalid'}
  });

  expect(res.status).toBe(401);
  expect(await res.text()).toBe('The API key is not valid.');
});

test('Should return 401 with a expired key', async t => {
  const helper = await IntegrationHarness.init(t);
  const {key} = await helper.createKey();

  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  vi.setSystemTime(expiresAt);

  const res = await api.request('/endpoints', {
    headers: {Authorization: `Bearer ${key}`}
  });

  expect(res.status).toBe(401);
  expect(await res.text()).toBe('The API key is expired.');
});
