import type {Fetcher} from '@cloudflare/workers-types';
import type {StatusCode, ContentfulStatusCode} from './http-status';
export type {StatusCode, ContentfulStatusCode};

export interface VaultOptions {
  url: string;
  token: string;
  serviceBinding?: Fetcher;
}

export interface ErrorResponse {
  status: ContentfulStatusCode;
  message: string;
}

export type Response<T> =
  | {data: T; error: null}
  | {data: null; error: ErrorResponse};
