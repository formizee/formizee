import {health as healthAPI} from '.';
import {test, expect} from 'vitest';

test('Should return 200', async () => {
  const result = await healthAPI.request('/');
  expect(await result.text()).toBe('OK');
});
