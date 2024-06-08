import {type User, type Response} from 'domain/models';
import {Email, Uid} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class LoadUser {
  private readonly _service = resolve('usersRepository');
  private readonly _identifier: Uid | Email;

  constructor(identifier: string) {
    try {
      this._identifier = new Uid(identifier);
    } catch {
      this._identifier = new Email(identifier);
    }
  }

  public async run(): Promise<Response<User>> {
    return await this._service.load(this._identifier);
  }
}
