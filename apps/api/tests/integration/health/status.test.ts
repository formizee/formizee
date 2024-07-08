import {it, expect, describe} from 'vitest';
import {health} from '@/routes/health';

describe('Health /status integration', () => {
  it('Should return 200', async () => {
    const response = await health.request('/');
    expect(await response.text()).toEqual('OK');
  });
});
