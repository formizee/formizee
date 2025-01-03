import type {Response} from '../types';

/**
 * Delete
 *****/

export interface DeleteRequest {
  endpointId: string;
}

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type DeleteResponse = Response<{}>;
