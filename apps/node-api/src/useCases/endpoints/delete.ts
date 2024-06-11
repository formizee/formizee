import {type Response} from 'domain/models';
import {Uid} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class DeleteEndpoint {
  private readonly _repository = resolve('endpointsRepository');
  private readonly _uid: Uid;

  constructor(uid: string) {
    this._uid = new Uid(uid);
  }

  async run(): Promise<Response<true>> {
    //eslint-disable-next-line -- Drizzle eslint plugin mistake
    return await this._repository.delete(this._uid);
  }
}
