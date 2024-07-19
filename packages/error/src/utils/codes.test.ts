import {describe, it, expect} from 'vitest';
import {ErrorCodeEnum} from './codes';

describe('Error Codes', () => {
  it('Should validate correct error codes', () => {
    const validErrorCodes = [
      'BAD_REQUEST',
      'FORBIDDEN',
      'INTERNAL_SERVER_ERROR',
      'USAGE_EXCEEDED',
      'DISABLED',
      'CONFLICT',
      'NOT_FOUND',
      'NOT_UNIQUE',
      'UNAUTHORIZED',
      'METHOD_NOT_ALLOWED',
      'UNPROCESSABLE_ENTITY'
    ];

    for (const code of validErrorCodes) {
      const result = ErrorCodeEnum.safeParse(code);
      expect(result.success).toBe(true);
    }
  });

  it('Should invalidate incorrect error codes', () => {
    const invalidErrorCodes = [
      'BAD_REQ',
      'UNAUTH',
      'NOT_FOUND_ERROR',
      'INVALID',
      '',
      '123',
      null,
      undefined,
      {},
      []
    ];

    for (const code of invalidErrorCodes) {
      const result = ErrorCodeEnum.safeParse(code);
      expect(result.success).toBe(false);
    }
  });
});
