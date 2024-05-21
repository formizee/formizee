import {Endpoint, Response} from 'domain/models';
import {Uid} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class LoadEndpoint {
  private readonly _repository = resolve('endpointsRepository');
  private readonly _uid: Uid;

  constructor(uid: string) {
    this._uid = new Uid(uid);
  }

  async run(): Promise<Response<Endpoint>> {
    return await this._repository.load(this._uid);
  }
}
