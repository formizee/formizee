import {type Endpoint, type Response} from 'domain/models';
import {Identifier} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class LoadAllEndpoints {
  private readonly _repository = resolve('endpointsRepository');
  private readonly _id: Identifier;

  constructor(owner: string) {
    this._id = new Identifier(owner);
  }

  async run(): Promise<Response<Endpoint[]>> {
    return await this._repository.loadAll(this._id);
  }
}
