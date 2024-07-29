import {describe, expect, it} from 'vitest';
import {base64} from './base64';

describe('@formizee/encoding', () => {
  it('Should decode base64', () => {
    const data = 'Zm9ybWl6ZWU=';
    const expectedResult = 'formizee';

    const result = new TextDecoder().decode(base64.decode(data));
    expect(result).toBe(expectedResult);
  });

  it('Should encode base64', () => {
    const data = 'formizee';
    const expectedResult = 'Zm9ybWl6ZWU=';

    const result = base64.encode(data);
    expect(result).toBe(expectedResult);
  });
});
