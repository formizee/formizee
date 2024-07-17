import {resolve} from '@/lib/di';
import type {Response, Submission} from 'domain/models';
import {Identifier} from 'domain/models/values';

export class LoadSubmission {
  private readonly _repository = resolve('submissionsRepository');
  private readonly _endpoint: Identifier;
  private readonly _id: Identifier;

  constructor(endpoint: string, id: string) {
    this._endpoint = new Identifier(endpoint);
    this._id = new Identifier(id);
  }

  async run(): Promise<Response<Submission>> {
    return await this._repository.load(this._endpoint, this._id);
  }
}
