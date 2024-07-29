// errorHandling.test.ts
import {Ok, Err, wrap, type Result} from './error-handling';
import {describe, it, expect} from 'vitest';
import {ErrorCodeEnum} from './utils/codes';
import {BaseError} from './models/base';

// Define a concrete implementation of BaseError for testing purposes
class TestError extends BaseError {
  public readonly name = 'TestError';
  public readonly code = ErrorCodeEnum.enum.INTERNAL_SERVER_ERROR;
}

// Define a test error factory
const errorFactory = (err: Error) => new TestError({message: err.message});

// Tests for the Ok and Err functions
describe('Result utilities', () => {
  it('should create an Ok result', () => {
    const okResult = Ok('value');
    expect(okResult).toEqual({val: 'value'});
  });

  it('should create an Err result', () => {
    const error = new TestError({message: 'Test error'});
    const errResult = Err(error);
    expect(errResult).toEqual({err: error});
  });
});

// Tests for the wrap function
describe('wrap function', () => {
  it('should return Ok result when promise resolves', async () => {
    const result: Result<string, TestError> = await wrap(
      Promise.resolve('value'),
      errorFactory
    );
    expect(result).toEqual({val: 'value'});
  });

  it('should return Err result when promise rejects', async () => {
    const result: Result<string, TestError> = await wrap(
      Promise.reject(new Error('Test error')),
      errorFactory
    );
    expect(result.err).toBeInstanceOf(TestError);
    expect(result.err?.message).toBe('Test error');
  });
});
