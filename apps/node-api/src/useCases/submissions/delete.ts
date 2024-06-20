import {type Response} from 'domain/models';
import {Identifier} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class DeleteSubmission {
  private readonly _repository = resolve('submissionsRepository');
  private readonly _endpoint: Identifier;
  private readonly _uid: Identifier;

  constructor(endpoint: string, uid: string) {
    this._endpoint = new Identifier(endpoint);
    this._uid = new Identifier(uid);
  }

  async run(): Promise<Response<true>> {
    //eslint-disable-next-line -- Drizzle eslint plugin mistake
    return await this._repository.delete(this._endpoint, this._uid);
  }
}
