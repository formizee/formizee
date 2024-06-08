import {type Endpoint, type Response} from 'domain/models';
import {Uid} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class LoadAllEndpoints {
  private readonly _repository = resolve('endpointsRepository');
  private readonly _uid: Uid;

  constructor(owner: string) {
    this._uid = new Uid(owner);
  }

  async run(): Promise<Response<Endpoint[]>> {
    return await this._repository.loadAll(this._uid);
  }
}
