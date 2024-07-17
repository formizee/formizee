import {resolve} from '@/lib/di';
import type {Endpoint, Response} from 'domain/models';
import {Identifier} from 'domain/models/values';

export class LoadEndpoint {
  private readonly _repository = resolve('endpointsRepository');
  private readonly _id: Identifier;

  constructor(id: string) {
    this._id = new Identifier(id);
  }

  async run(): Promise<Response<Endpoint>> {
    return await this._repository.load(this._id);
  }
}
