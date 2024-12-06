import {describe, it, expect, vi} from 'vitest';
import {ZodError, type ZodIssue} from 'zod';
import {SchemaError} from './schema';
import {BaseError} from './base';

// Mock implementation for parseZodErrorIssues
vi.mock('../utils', () => ({
  parseZodErrorIssues: (issues: ZodIssue[]) => {
    return issues.map(issue => issue.message).join('; ');
  }
}));

describe('SchemaError', () => {
  it('should create an instance of SchemaError with correct properties', () => {
    const context = {raw: 'invalid data'};
    const error = new SchemaError({
      code: 'UNPROCESSABLE_ENTITY',
      message: 'Validation failed',
      context
    });

    expect(error).toBeInstanceOf(BaseError);
    expect(error).toBeInstanceOf(SchemaError);
    expect(error.name).toBe('SchemaError');
    expect(error.code).toBe('UNPROCESSABLE_ENTITY');
    expect(error.message).toBe('Validation failed');
    expect(error.context).toBe(context);
  });

  it('should create a SchemaError from a ZodError', () => {
    const issues: ZodIssue[] = [
      {
        code: 'invalid_type',
        expected: 'string',
        received: 'number',
        path: ['field1'],
        message: 'Expected string, received number'
      }
    ];
    const zodError = new ZodError(issues);
    const raw = {field1: 123};

    const error = SchemaError.fromZod(zodError, raw);

    expect(error).toBeInstanceOf(SchemaError);
    expect(error.code).toBe('UNPROCESSABLE_ENTITY');
    expect(error.message).toBe('Expected string, received number');
    expect(error.context).toEqual({raw: JSON.stringify(raw)});
  });
});
