import {health} from '@/routes/health';
import {describe, expect, it} from 'vitest';

describe('Health /status integration', () => {
  it('Should return 200', async () => {
    const response = await health.request('/');
    expect(await response.text()).toEqual('OK');
  });
});
