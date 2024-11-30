import type {VaultOptions} from '../types';

import type {
  DeleteRequest,
  DeleteResponse,
  GetRequest,
  GetResponse,
  ListRequest,
  ListResponse,
  PostRequest,
  PostResponse,
  PutRequest,
  PutResponse
} from './types';

export class Submissions {
  private readonly url: string;
  private readonly token: string;

  constructor(opts: VaultOptions) {
    this.url = opts.url;
    this.token = opts.token;
  }

  public async get(input: GetRequest): Promise<GetResponse | null> {
    const url = `${this.url}/v1/submission/${input.endpointId}/${input.id}`;

    const response = await fetch(url, {
      headers: {Authorization: `Bearer ${this.token}`},
      method: 'GET'
    });

    if (!response.ok) {
      console.error(response.text);
      return Promise.resolve(null);
    }

    try {
      const submission = await response.json();
      return Promise.resolve(submission as GetResponse);
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }

  public async list(input: ListRequest): Promise<ListResponse | null> {
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

    if (!response.ok) {
      console.error(response.text);
      return Promise.resolve(null);
    }

    try {
      const submission = await response.json();
      return Promise.resolve(submission as ListResponse);
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }

  public async post(input: PostRequest): Promise<PostResponse | null> {
    const url = `${this.url}/v1/submission/${input.endpointId}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(input)
    });

    if (!response.ok) {
      console.error(response.text);
      return Promise.resolve(null);
    }

    try {
      const submission = await response.json();
      return Promise.resolve(submission as PostResponse);
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }

  public async put(input: PutRequest): Promise<PutResponse | null> {
    const url = `${this.url}/v1/submission/${input.endpointId}/${input.id}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      method: 'PUT',
      body: JSON.stringify({isSpam: input.isSpam, isRead: input.isRead})
    });

    if (!response.ok) {
      console.error(response.text);
      return Promise.resolve(null);
    }

    try {
      const submission = await response.json();
      return Promise.resolve(submission as PutResponse);
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }

  public async delete(input: DeleteRequest): Promise<DeleteResponse | null> {
    const url = `${this.url}/v1/submission/${input.endpointId}/${input.id}`;

    const response = await fetch(url, {
      headers: {Authorization: `Bearer ${this.token}`},
      method: 'DELETE'
    });

    if (!response.ok) {
      console.error(response.text);
      return Promise.resolve(null);
    }

    try {
      return Promise.resolve({});
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }
}
