import type {Response} from '../types';

// GET

export interface GetRequest {
  endpointId: string;
}

export type GetResponse = Response<{storageUsed: number}>;

// POST

export interface PostRequest {
  endpointId: string;
  storageUsed: number;
}

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type PostResponse = Response<{}>;
