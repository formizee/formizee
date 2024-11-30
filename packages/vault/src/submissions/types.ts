import type {schema} from '@formizee/db/submissions';

/**
 * GET
 *****/

export interface GetRequest {
  endpointId: string;
  id: string;
}

export type GetResponse = schema.Submission;

/**
 * LIST
 *****/

export interface ListRequest {
  endpointId: string;
  page?: number;
  limit?: number;
}

export interface ListResponse {
  _metadata: {
    page: number;
    totalPages: number;
    itemsPerPage: number;
    schema: Record<string, 'string' | 'file'>;
  };
  submissions: schema.Submission[];
}

/**
 * POST
 *****/

export interface PostRequest {
  endpointId: string;
  data: Record<string, string>;
  fileUploads: {name: string; field: string}[];
  location: string;
}

export interface PostResponse {
  id: string;
  endpointId: string;
  pendingUploads: {name: string; url: string | null}[];
  isSpam: boolean;
  isRead: boolean;
  location: string;
  createdAt: Date;
}

/**
 * PUT
 *****/

export interface PutRequest {
  id: string;
  endpointId: string;
  isRead?: boolean;
  isSpam?: boolean;
}

export interface PutResponse {
  id: string;
  endpointId: string;
  isRead: boolean;
  isSpam: boolean;
  location: string;
  createdAt: Date;
  iv: string;
  cipherText: string;
}

/**
 * Delete
 *****/

export interface DeleteRequest {
  endpointId: string;
  id: string;
}

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type DeleteResponse = {};
