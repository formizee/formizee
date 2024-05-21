import {Uid} from 'domain/models/values';
import {Response} from 'domain/models';
import {resolve} from '@/lib/di';

export class LoadUserPasswordHash {
  private readonly _service = resolve('usersRepository');
  private readonly _identifier: Uid;

  constructor(identifier: string) {
    this._identifier = new Uid(identifier);
  }

  public async run(): Promise<Response<string>> {
    return await this._service.loadPasswordHash(this._identifier);
  }
}
