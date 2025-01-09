import type {Response} from '../types';

/**
 * Metrics
 *****/

export interface MetricsRequest {
  endpointId: string;
}
export type MetricsResponse = Response<{totalSubmissions: number}>;

/**
 * Delete
 *****/

export interface DeleteRequest {
  endpointId: string;
}

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type DeleteResponse = Response<{}>;
