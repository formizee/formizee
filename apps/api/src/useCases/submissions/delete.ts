import {type Response} from 'domain/models';
import {Identifier} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class DeleteSubmission {
  private readonly _repository = resolve('submissionsRepository');
  private readonly _uid: Identifier;

  constructor(uid: string) {
    this._uid = new Identifier(uid);
  }

  async run(): Promise<Response<true>> {
    return await this._repository.delete(this._uid);
  }
}
