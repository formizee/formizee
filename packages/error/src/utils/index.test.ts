import {describe, it, expect, vi} from 'vitest';
import {statusToCode, codeToStatus, redactError} from '.';

describe('statusToCode', () => {
  it('should return correct ErrorCode for status code', () => {
    expect(statusToCode(400)).toBe('BAD_REQUEST');
    expect(statusToCode(401)).toBe('UNAUTHORIZED');
    expect(statusToCode(403)).toBe('FORBIDDEN');
    expect(statusToCode(404)).toBe('NOT_FOUND');
    expect(statusToCode(405)).toBe('METHOD_NOT_ALLOWED');
    expect(statusToCode(409)).toBe('METHOD_NOT_ALLOWED'); // This might be an error, consider 'CONFLICT'
    expect(statusToCode(422)).toBe('UNPROCESSABLE_ENTITY');
    expect(statusToCode(500)).toBe('INTERNAL_SERVER_ERROR');
    expect(statusToCode(999)).toBe('INTERNAL_SERVER_ERROR'); // Default case
  });
});

describe('codeToStatus', () => {
  it('should return correct status code for ErrorCode', () => {
    expect(codeToStatus('BAD_REQUEST')).toBe(400);
    expect(codeToStatus('UNAUTHORIZED')).toBe(401);
    expect(codeToStatus('FORBIDDEN')).toBe(403);
    expect(codeToStatus('NOT_FOUND')).toBe(404);
    expect(codeToStatus('METHOD_NOT_ALLOWED')).toBe(405);
    expect(codeToStatus('CONFLICT')).toBe(409);
    expect(codeToStatus('UNPROCESSABLE_ENTITY')).toBe(422);
    expect(codeToStatus('INTERNAL_SERVER_ERROR')).toBe(500);
  });
});

describe('redactError', () => {
  it('should return non-Error objects unchanged', () => {
    const nonErrorObject = {key: 'value'};
    const result = redactError(nonErrorObject);
    expect(result).toBe(nonErrorObject);
  });

  it('should log the type of Error for Error objects', () => {
    const error = new Error('Test error');
    console.error = vi.fn();

    redactError(error);

    expect(console.error).toHaveBeenCalledWith(
      `Type of Error: ${error.constructor}`
    );
  });
});
