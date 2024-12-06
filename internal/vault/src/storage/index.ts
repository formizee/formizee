import type {GetRequest, GetResponse, PostRequest, PostResponse} from './types';
import type {StatusCode, VaultOptions} from '../types';

export class Storage {
  private readonly url: string;
  private readonly token: string;

  constructor(opts: VaultOptions) {
    this.url = opts.url;
    this.token = opts.token;
  }

  public async get(input: GetRequest): Promise<GetResponse> {
    const url = `${this.url}/v1/storage/${input.endpointId}`;

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
        data: body as {storageUsed: number},
        error: null
      });
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }

  public async post(input: PostRequest): Promise<PostResponse> {
    const url = `${this.url}/v1/storage/${input.endpointId}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(input.storageUsed)
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
        data: {},
        error: null
      });
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }
}
