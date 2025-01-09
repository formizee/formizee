import type {
  DeleteRequest,
  DeleteResponse,
  MetricsRequest,
  MetricsResponse
} from './types';
import type {StatusCode, VaultOptions} from '../types';
import {FetchWrapper} from '../fetcher';

export class Endpoints {
  private readonly url: string;
  private readonly token: string;
  private readonly service: FetchWrapper;

  constructor(opts: VaultOptions) {
    this.url = opts.url;
    this.token = opts.token;
    this.service = new FetchWrapper(opts.serviceBinding);
  }

  public async metrics(input: MetricsRequest): Promise<MetricsResponse> {
    const url = `${this.url}/v1/endpoint/metrics/${input.endpointId}`;

    const response = await fetch(url, {
      headers: {Authorization: `Bearer ${this.token}`},
      method: 'GET'
    });

    try {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const body = (await response.json()) as any;

      if (response.status !== 200) {
        return Promise.resolve({
          data: null,
          error: {
            status: response.status as StatusCode,
            message: body.message
          }
        });
      }

      return Promise.resolve({
        data: body as {totalSubmissions: number},
        error: null
      });
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }

  public async delete(input: DeleteRequest): Promise<DeleteResponse> {
    const url = `${this.url}/v1/endpoint/${input.endpointId}`;

    const response = await this.service.fetch(url, {
      headers: {Authorization: `Bearer ${this.token}`},
      method: 'DELETE'
    });

    try {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const body = (await response.json()) as any;

      if (response.status !== 200) {
        return Promise.resolve({
          data: null,
          error: {
            status: response.status as StatusCode,
            message: body.message
          }
        });
      }

      return Promise.resolve({
        data: {},
        error: null
      });
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }
}
