import {getConnInfo} from '@hono/node-server/conninfo';
import {describe, it, expect, vi, beforeEach} from 'vitest';
import {getOriginCountry} from './country';
import type {Context} from 'hono';

vi.mock('@hono/node-server/conninfo', () => ({
  getConnInfo: vi.fn()
}));

describe('getOriginCountry', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('Should return country when fetch is successful and response is valid', async () => {
    // Arrange
    const mockAddress = '8.8.8.8';
    // biome-ignore lint:
    const context: Context = {} as any;

    // Mock getConnInfo to return the desired address
    // @ts-ignore
    (getConnInfo as vi.Mock).mockReturnValue({remote: {address: mockAddress}});

    global.fetch = vi.fn(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            country_3: 'USA',
            country: 'US',
            name: 'United States',
            ip: '8.8.8.8'
          }),
          {
            status: 200,
            headers: {'Content-type': 'application/json'}
          }
        )
      )
    );

    // Act
    const result = await getOriginCountry(context);

    // Assert
    expect(result).toBe('United States');
  });

  it('Should return "Unknown" when address is not provided', async () => {
    // Arrange
    // biome-ignore lint:
    const context = {} as any; // Mock context object

    // Mock getConnInfo to return an empty address
    // @ts-ignore
    (getConnInfo as vi.Mock).mockReturnValue({remote: {address: undefined}});
    //
    // Act
    const result = await getOriginCountry(context);

    // Assert
    expect(result).toBe('Unknown');
  });

  it('Should return "Unknown" when response JSON does not have country', async () => {
    // Arrange
    const mockAddress = '127.0.0.1';
    // biome-ignore lint:
    const context = {} as any; // Mock context object

    // Mock getConnInfo to return the desired address
    // @ts-ignore
    (getConnInfo as vi.Mock).mockReturnValue({remote: {address: mockAddress}});

    // Act
    const result = await getOriginCountry(context);

    // Assert
    expect(result).toBe('Unknown');
  });
});
