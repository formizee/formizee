import type {Response} from '../types';

export interface ResponseSubmission {
  id: string;
  endpointId: string;
  data: Record<string, string>;
  createdAt: Date;
  location: string;
  isRead: boolean;
  isSpam: boolean;
}

/**
 * GET
 *****/

export interface GetRequest {
  endpointId: string;
  id: string;
}

export type GetResponseData = ResponseSubmission;

export type GetResponse = Response<GetResponseData>;

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
  submissions: ResponseSubmission[];
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
  pendingUploads: {field: string; url: string | null}[];
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
  isSpam: boolean;
  isRead: boolean;
  location: string;
  createdAt: Date;
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
