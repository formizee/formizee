// getOriginCountry.test.ts
import {describe, it, expect, vi, beforeEach} from 'vitest';
import {getOriginCountry} from './country';
import {getConnInfo} from '@hono/node-server/conninfo';
import {lookup} from 'geoip-lite';
import type {Context} from 'hono';

// Mock the external dependencies
vi.mock('@hono/node-server/conninfo', () => ({
  getConnInfo: vi.fn()
}));

vi.mock('geoip-lite', () => ({
  lookup: vi.fn()
}));

describe('getOriginCountry', () => {
  // biome-ignore lint:
  const mockContext: Context = {} as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return "Unknown" for loopback address', () => {
    (getConnInfo as vi.Mock).mockReturnValue({remote: {address: '127.0.0.1'}});

    const result = getOriginCountry(mockContext);

    expect(result).toBe('Unknown');
  });

  it('should return "Unknown" for undefined address', () => {
    (getConnInfo as vi.Mock).mockReturnValue({remote: {address: undefined}});

    const result = getOriginCountry(mockContext);

    expect(result).toBe('Unknown');
  });

  it('should return "Unknown" for address with no geo info', () => {
    (getConnInfo as vi.Mock).mockReturnValue({remote: {address: '8.8.8.8'}});
    (lookup as vi.Mock).mockReturnValue(null);

    const result = getOriginCountry(mockContext);

    expect(result).toBe('Unknown');
  });

  it('should return country code for a valid address', () => {
    (getConnInfo as vi.Mock).mockReturnValue({remote: {address: '8.8.8.8'}});
    (lookup as vi.Mock).mockReturnValue({country: 'US'});

    const result = getOriginCountry(mockContext);

    expect(result).toBe('US');
  });

  it('should handle errors and return "Unknown"', () => {
    (getConnInfo as vi.Mock).mockImplementation(() => {
      throw new Error('Test error');
    });

    const result = getOriginCountry(mockContext);

    expect(result).toBe('Unknown');
  });
});
