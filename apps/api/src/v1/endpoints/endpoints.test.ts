import {clearDatabase, seedDatabase} from '@formizee/db/testing';
import {beforeEach, expect, test, vi} from 'vitest';
import api from '@/v1';

vi.stubEnv('DATABASE_URL', 'postgresql://formizee:formizee@localhost/test');
vi.stubEnv('WEB_URL', 'https://formizee.com');

beforeEach(async () => {
  await clearDatabase();
  await seedDatabase();
});
test('GET', async () => {
  const res = await api.request('/endpoints/enp_9CWDA9MKp3UHDwyqxrBt5AbEWfJ', {
    method: 'GET',
    headers: {Authorization: 'Bearer 1'}
  });

  expect(res.status).toBe(200);
  expect(await res.json()).toStrictEqual({
    id: 'enp_9CWDA9MKp3UHDwyqxrBt5AbEWfJ',
    workspaceId: 'ws_9CWDA9MKp3UHDwyqxrBt5AbEWfJ',
    slug: 'my-endpoint',
    isEnabled: true,
    emailNotifications: true,
    redirectUrl: 'https://formizee.com/thanks-you',
    targetEmails: ['pauchiner@formizee.com'],
    icon: 'file',
    color: 'gray'
  });
});

test('PUT', async () => {
  const res = await api.request('/endpoints/enp_9CWDA9MKp3UHDwyqxrBt5AbEWfJ', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer 1'
    },
    body: JSON.stringify({slug: 'example2'})
  });

  expect(res.status).toBe(200);
  expect(await res.json()).toMatchObject({
    workspaceId: 'ws_9CWDA9MKp3UHDwyqxrBt5AbEWfJ',
    slug: 'example2',
    isEnabled: true,
    emailNotifications: true,
    redirectUrl: 'https://formizee.com/thanks-you',
    targetEmails: ['pauchiner@formizee.com'],
    icon: 'file',
    color: 'gray'
  });
});

test('LIST', async () => {
  const res = await api.request('/endpoints', {
    method: 'GET',
    headers: {Authorization: 'Bearer 1'}
  });

  expect(res.status).toBe(200);
  expect(await res.json()).toStrictEqual([
    {
      id: 'enp_9CWDA9MKp3UHDwyqxrBt5AbEWfJ',
      workspaceId: 'ws_9CWDA9MKp3UHDwyqxrBt5AbEWfJ',
      slug: 'my-endpoint',
      isEnabled: true,
      emailNotifications: true,
      redirectUrl: 'https://formizee.com/thanks-you',
      targetEmails: ['pauchiner@formizee.com'],
      icon: 'file',
      color: 'gray'
    }
  ]);
});

test('POST', async () => {
  const res = await api.request('/endpoints', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer 1'
    },
    body: JSON.stringify({slug: 'example'})
  });

  expect(res.status).toBe(201);
  expect(await res.json()).toMatchObject({
    workspaceId: 'ws_9CWDA9MKp3UHDwyqxrBt5AbEWfJ',
    slug: 'example',
    isEnabled: true,
    emailNotifications: true,
    redirectUrl: 'https://formizee.com/thanks-you',
    targetEmails: ['pauchiner@formizee.com'],
    icon: 'file',
    color: 'gray'
  });
});

test('DELETE', async () => {
  const res = await api.request('/endpoints/enp_9CWDA9MKp3UHDwyqxrBt5AbEWfJ', {
    method: 'DELETE',
    headers: {Authorization: 'Bearer 1'}
  });

  expect(res.status).toBe(200);
  expect(await res.json()).toStrictEqual({});
});
