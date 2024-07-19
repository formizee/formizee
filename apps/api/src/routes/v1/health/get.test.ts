import {test, expect, vi, type Mock} from 'vitest';
import {healthAPI} from './index';

globalThis.fetch = vi.fn();

vi.mock('@enviroment', () => ({
  env: {
    DOCS_URL: 'http://localhost:3002'
  }
}));

test('Should return 200', async () => {
  (globalThis.fetch as Mock).mockResolvedValue({
    ok: true,
    text: 'OK'
  });

  const result = await healthAPI.request('/');
  expect(await result.text()).toBe('OK');
});
