import type {ErrorCode} from '../utils/codes';
import {parseZodErrorIssues} from '../utils';
import type {ZodError} from 'zod';
import {BaseError} from './base';

type Context = {raw: unknown};

export class SchemaError extends BaseError<Context> {
  public readonly name = SchemaError.name;
  public readonly code: ErrorCode;

  constructor(opts: {
    code: ErrorCode;
    message: string;
    cause?: BaseError;
    context?: Context;
  }) {
    super(opts);
    this.code = opts.code;
  }

  private static removeCircularReferences() {
    const seen = new WeakSet();
    // biome-ignore lint:
    return (_key: any, value: any) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return; // Omitting circular reference
        }
        seen.add(value);
      }
      return value;
    };
  }

  static fromZod<T>(e: ZodError<T>, raw: unknown): SchemaError {
    const rawString = JSON.stringify(
      raw,
      SchemaError.removeCircularReferences()
    );
    return new SchemaError({
      code: 'UNPROCESSABLE_ENTITY',
      message: parseZodErrorIssues(e.issues),
      context: {raw: rawString}
    });
  }
}
