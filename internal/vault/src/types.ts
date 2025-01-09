import type {Fetcher} from '@cloudflare/workers-types';
import type {StatusCode} from './http-status';
export type {StatusCode};

export interface VaultOptions {
  url: string;
  token: string;
  serviceBinding?: Fetcher;
}

export interface ErrorResponse {
  status: StatusCode;
  message: string;
}

export type Response<T> =
  | {data: T; error: null}
  | {data: null; error: ErrorResponse};
