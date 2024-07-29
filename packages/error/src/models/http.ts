import type {ErrorCode} from '../utils/codes';
import {statusToCode} from '../utils';
import {BaseError} from './base';

type Context = {
  url?: string;
  method?: string;
  statusCode?: number;
};

export class HttpError extends BaseError<Context> {
  public readonly name = HttpError.name;
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

  public static fromRequest(request: Request, response: Response) {
    return new HttpError({
      code: statusToCode(response.status),
      message: response.statusText, // can be overriden with { ...res, statusText: 'Custom message' }
      context: {
        url: request.url,
        method: request.method,
        statusCode: response.status
      }
    });
  }
}
