import type {schema} from '@formizee/db/submissions';
import type {StatusCode, VaultOptions} from '../types';

import type {
  DeleteRequest,
  DeleteResponse,
  GetRequest,
  GetResponse,
  ListRequest,
  ListResponse,
  ListResponseData,
  PostRequest,
  PostResponse,
  PostResponseData,
  PutRequest,
  PutResponse,
  PutResponseData
} from './types';

export class Submissions {
  private readonly url: string;
  private readonly token: string;

  constructor(opts: VaultOptions) {
    this.url = opts.url;
    this.token = opts.token;
  }

  public async get(input: GetRequest): Promise<GetResponse> {
    const url = `${this.url}/v1/submission/${input.endpointId}/${input.id}`;

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
            message: body.message ?? 'Unexpected Error'
          }
        });
      }

      return Promise.resolve({
        data: body as schema.Submission,
        error: null
      });
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }

  public async list(input: ListRequest): Promise<ListResponse> {
    const url = `${this.url}/v1/submissions/${input.endpointId}`;
    const queryUrl = new URL(url);
    if (input.page) {
      queryUrl.searchParams.append('page', String(input.page));
    }
    if (input.limit) {
      queryUrl.searchParams.append('limit', String(input.limit));
    }

    const response = await fetch(queryUrl, {
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
        data: body as ListResponseData,
        error: null
      });
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }

  public async post(input: PostRequest): Promise<PostResponse> {
    const url = `${this.url}/v1/submission/${input.endpointId}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(input)
    });

    try {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const body = (await response.json()) as any;

      if (response.status !== 201) {
        return Promise.resolve({
          data: null,
          error: {
            status: response.status as StatusCode,
            message: body.message
          }
        });
      }

      return Promise.resolve({
        data: body as PostResponseData,
        error: null
      });
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }

  public async put(input: PutRequest): Promise<PutResponse> {
    const url = `${this.url}/v1/submission/${input.endpointId}/${input.id}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      method: 'PUT',
      body: JSON.stringify({isSpam: input.isSpam, isRead: input.isRead})
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
        data: body as PutResponseData,
        error: null
      });
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }

  public async delete(input: DeleteRequest): Promise<DeleteResponse> {
    const url = `${this.url}/v1/submission/${input.endpointId}/${input.id}`;

    const response = await fetch(url, {
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
