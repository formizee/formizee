import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {logger} from './logger';
import {Hono} from 'hono';

// Utility to mock console.log
const mockConsoleLog = () => {
  const logs: string[] = [];
  const originalLog = console.log;
  console.log = vi.fn((message: string) => {
    logs.push(message);
  });
  return {
    logs,
    restore: () => {
      console.log = originalLog;
    }
  };
};

describe('Logger Middleware', () => {
  let mockLog: ReturnType<typeof mockConsoleLog>;

  beforeEach(() => {
    mockLog = mockConsoleLog();
  });

  afterEach(() => {
    mockLog.restore();
  });

  it('should log GET requests in green', async () => {
    const app = new Hono();

    // Use the logger middleware
    app.use('*', logger);

    // Simulate a GET request
    await app.request('/test');

    expect(mockLog.logs).toHaveLength(2);
    expect(mockLog.logs[0]).toContain('\x1b[32mGET\x1b[0m');
  });

  it('should log POST requests in blue', async () => {
    const app = new Hono();

    // Use the logger middleware
    app.use('*', logger);

    // Simulate a POST request
    await app.request('/test', {
      method: 'POST'
    });

    expect(mockLog.logs).toHaveLength(2);
    expect(mockLog.logs[0]).toContain('\x1b[34mPOST\x1b[0m');
  });

  it('should log PUT requests in yellow', async () => {
    const app = new Hono();

    // Use the logger middleware
    app.use('*', logger);

    // Simulate a PUT request
    await app.request('/test', {
      method: 'PUT'
    });

    expect(mockLog.logs).toHaveLength(2);
    expect(mockLog.logs[0]).toContain('\x1b[33mPUT\x1b[0m');
  });

  it('should log DELETE requests in red', async () => {
    const app = new Hono();

    // Use the logger middleware
    app.use('*', logger);

    // Simulate a DELETE request
    await app.request('/test', {
      method: 'DELETE'
    });

    expect(mockLog.logs).toHaveLength(2);
    expect(mockLog.logs[0]).toContain('\x1b[31mDELETE\x1b[0m');
  });
});
