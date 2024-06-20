import {type Endpoint, type Response} from 'domain/models';
import {Identifier} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class LoadEndpointsByOwner {
  private readonly _repository = resolve('endpointsRepository');
  private readonly _uid: Identifier;

  constructor(owner: string) {
    this._uid = new Identifier(owner);
  }

  async run(): Promise<Response<Endpoint[]>> {
    return await this._repository.loadByOwner(this._uid);
  }
}
