import {resolve} from '@/lib/di';
import type {Response} from 'domain/models';
import {Identifier} from 'domain/models/values';

export class DeleteEndpoint {
  private readonly _repository = resolve('endpointsRepository');
  private readonly _id: Identifier;

  constructor(id: string) {
    this._id = new Identifier(id);
  }

  async run(): Promise<Response<true>> {
    //eslint-disable-next-line -- Drizzle eslint plugin mistake
    return await this._repository.delete(this._id);
  }
}
