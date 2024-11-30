import type {DeleteRequest, DeleteResponse} from './types';
import type {VaultOptions} from '../types';

export class Endpoints {
  private readonly url: string;
  private readonly token: string;

  constructor(opts: VaultOptions) {
    this.url = opts.url;
    this.token = opts.token;
  }

  public async delete(input: DeleteRequest): Promise<DeleteResponse | null> {
    const url = `${this.url}/v1/endpoint/${input.endpointId}`;

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
