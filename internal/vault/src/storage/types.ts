import type {Response} from '../types';

// GET

export interface GetRequest {
  endpointId: string;
}

export type GetResponse = Response<{storageUsed: number}>;

// PUT

export interface PutRequest {
  endpointId: string;
  storageUsed: number;
}

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type PutResponse = Response<{}>;
