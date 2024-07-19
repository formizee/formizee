import {describe, it, expect} from 'vitest';
import {ErrorCodeEnum} from '../utils';
import {BaseError} from './base';

// Define a concrete implementation of BaseError for testing purposes
class TestError extends BaseError {
  public readonly name = 'TestError';
  public readonly code = ErrorCodeEnum.enum.INTERNAL_SERVER_ERROR;
}

describe('Base Error', () => {
  it('should create an instance of BaseError with correct properties', () => {
    const causeError = new TestError({message: 'Cause error'});
    const context = {key: 'value'};
    const error = new TestError({
      message: 'Test error message',
      cause: causeError,
      context
    });

    expect(error).toBeInstanceOf(BaseError);
    expect(error.name).toBe('TestError');
    expect(error.message).toBe('Test error message');
    expect(error.cause).toBe(causeError);
    expect(error.context).toBe(context);
    expect(error.toString()).toBe(
      'TestError(INTERNAL_SERVER_ERROR): Test error message - caused by TestError(INTERNAL_SERVER_ERROR): Cause error - caused by undefined - with context undefined - with context {"key":"value"}'
    );
  });
});
