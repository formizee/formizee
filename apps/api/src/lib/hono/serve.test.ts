import {describe, it, expect, afterEach, beforeEach, vi} from 'vitest';
import {serve as serverMock} from '@hono/node-server';
import {serve} from './serve';

vi.mock('@hono/node-server');
vi.mock('node:perf_hooks', () => ({
  performance: {
    now: vi.fn()
  }
}));
vi.mock('@/lib/enviroment', () => ({
  env: {
    API_URL: 'http://localhost:3000'
  }
}));
vi.mock('@/../package.json', () => ({
  version: '1.0.0'
}));

describe('serve', () => {
  beforeEach(() => {
    // Mock console.info to suppress output
    vi.spyOn(console, 'info').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore the original console.info after each test
    vi.restoreAllMocks();
  });

  it('should start the server with the correct parameters', () => {
    // biome-ignore lint:
    const app = {fetch: vi.fn()} as any;

    serve(app);

    expect(serverMock).toHaveBeenCalledWith({
      fetch: app.fetch,
      port: 3000
    });

    //const callDuration = Math.round(endTime - startTime).toString();
    //expect(callDuration).toBe('50');
  });
});
