import type {ZodIssue} from 'zod';
import type {ErrorCode} from './codes';

export function statusToCode(status: number): ErrorCode {
  switch (status) {
    case 400:
      return 'BAD_REQUEST';
    case 401:
      return 'UNAUTHORIZED';
    case 403:
      return 'FORBIDDEN';
    case 404:
      return 'NOT_FOUND';
    case 405:
      return 'METHOD_NOT_ALLOWED';
    case 409:
      return 'METHOD_NOT_ALLOWED';
    case 413:
      return 'PAYLOAD_TOO_LARGE';
    case 415:
      return 'UNSUPPORTED_MEDIA_TYPE';
    case 422:
      return 'UNPROCESSABLE_ENTITY';
    case 429:
      return 'TOO_MANY_REQUESTS';
    case 500:
      return 'INTERNAL_SERVER_ERROR';
    case 504:
      return 'GATEWAY_TIMEOUT';
    default:
      return 'INTERNAL_SERVER_ERROR';
  }
}

export function codeToStatus(code: ErrorCode): number {
  switch (code) {
    case 'BAD_REQUEST':
      return 400;
    case 'UNAUTHORIZED':
      return 401;
    case 'FORBIDDEN':
      return 403;
    case 'NOT_FOUND':
      return 404;
    case 'METHOD_NOT_ALLOWED':
      return 405;
    case 'CONFLICT':
      return 409;
    case 'PAYLOAD_TOO_LARGE':
      return 413;
    case 'UNSUPPORTED_MEDIA_TYPE':
      return 415;
    case 'UNPROCESSABLE_ENTITY':
      return 422;
    case 'TOO_MANY_REQUESTS':
      return 429;
    case 'INTERNAL_SERVER_ERROR':
      return 500;
    case 'GATEWAY_TIMEOUT':
      return 504;
    /* v8 ignore next 2 */
    default:
      return 500;
  }
}

export function parseZodErrorIssues(issues: ZodIssue[]): string {
  return issues
    .map(i =>
      i.code === 'invalid_union'
        ? i.unionErrors.map(ue => parseZodErrorIssues(ue.issues)).join('; ')
        : i.code === 'unrecognized_keys'
          ? i.message
          : `${i.path.length ? `${i.code} in '${i.path}': ` : ''}${i.message}`
    )
    .join('; ');
}

export function redactError<TError extends Error | unknown>(error: TError) {
  if (!(error instanceof Error)) {
    return error;
  }

  console.error(`Type of Error: ${error.constructor}`);
}
