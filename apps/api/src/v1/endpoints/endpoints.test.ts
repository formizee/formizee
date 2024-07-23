import {omit, IntegrationHarness} from '@/lib/testing';
import {expect, test} from 'vitest';
import api from '@/v1';

test('GET', async t => {
  const helper = await IntegrationHarness.init(t);
  const endpoint = helper.resources.endpoint;
  const {key} = await helper.createKey();

  const res = await api.request(`/endpoints/${endpoint.id}`, {
    method: 'GET',
    headers: {Authorization: `Bearer ${key}`}
  });

  expect(res.status).toBe(200);
  expect(await res.json()).toStrictEqual(
    omit(endpoint, ['createdAt', 'updatedAt'])
  );
});

test('PUT', async t => {
  const helper = await IntegrationHarness.init(t);
  const endpoint = helper.resources.endpoint;
  const {key} = await helper.createKey();

  const res = await api.request(`/endpoints/${endpoint.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`
    },
    body: JSON.stringify({slug: 'example'})
  });

  expect(res.status).toBe(200);
  expect(await res.json()).toMatchObject({
    ...omit(endpoint, ['createdAt', 'updatedAt']),
    slug: 'example'
  });
});

test('LIST', async t => {
  const helper = await IntegrationHarness.init(t);
  const endpoint = helper.resources.endpoint;
  const {key} = await helper.createKey();

  const res = await api.request('/endpoints', {
    method: 'GET',
    headers: {Authorization: `Bearer ${key}`}
  });

  expect(res.status).toBe(200);
  expect(await res.json()).toStrictEqual([
    omit(endpoint, ['createdAt', 'updatedAt'])
  ]);
});

test('POST', async t => {
  const helper = await IntegrationHarness.init(t);
  const workspace = helper.resources.workspace;
  const {key} = await helper.createKey();

  const res = await api.request('/endpoints', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`
    },
    body: JSON.stringify({
      slug: 'example',
      targetEmails: ['example@formizee.com']
    })
  });

  expect(res.status).toBe(201);
  expect(await res.json()).toMatchObject({
    workspaceId: workspace.id,
    slug: 'example',
    isEnabled: true,
    emailNotifications: true,
    redirectUrl: 'https://formizee.com/thanks-you',
    targetEmails: ['example@formizee.com'],
    icon: 'file',
    color: 'gray'
  });
});

test('DELETE', async t => {
  const helper = await IntegrationHarness.init(t);
  const {key} = await helper.createKey();
  const id = helper.resources.endpoint.id;

  const res = await api.request(`/endpoints/${id}`, {
    method: 'DELETE',
    headers: {Authorization: `Bearer ${key}`}
  });

  expect(res.status).toBe(200);
  expect(await res.json()).toStrictEqual({});
});
