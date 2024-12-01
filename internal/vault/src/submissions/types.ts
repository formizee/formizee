import type {schema} from '@formizee/db/submissions';
import type {Response} from '../types';

/**
 * GET
 *****/

export interface GetRequest {
  endpointId: string;
  id: string;
}

export type GetResponse = Response<schema.Submission>;

/**
 * LIST
 *****/

export interface ListRequest {
  endpointId: string;
  page?: number;
  limit?: number;
}

export interface ListResponseData {
  _metadata: {
    page: number;
    totalPages: number;
    itemsPerPage: number;
    schema: Record<string, 'string' | 'file'>;
  };
  submissions: schema.Submission[];
}

export type ListResponse = Response<ListResponseData>;

/**
 * POST
 *****/

export interface PostRequest {
  endpointId: string;
  data: Record<string, string>;
  fileUploads: {name: string; field: string}[];
  location: string;
}

export interface PostResponseData {
  id: string;
  endpointId: string;
  pendingUploads: {name: string; url: string | null}[];
  isSpam: boolean;
  isRead: boolean;
  location: string;
  createdAt: Date;
}

export type PostResponse = Response<PostResponseData>;

/**
 * PUT
 *****/

export interface PutRequest {
  id: string;
  endpointId: string;
  isRead?: boolean;
  isSpam?: boolean;
}

export interface PutResponseData {
  id: string;
  endpointId: string;
  isRead: boolean;
  isSpam: boolean;
  location: string;
  createdAt: Date;
  iv: string;
  cipherText: string;
}

export type PutResponse = Response<PutResponseData>;
/**
 * Delete
 *****/

export interface DeleteRequest {
  endpointId: string;
  id: string;
}

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type DeleteResponse = Response<{}>;
