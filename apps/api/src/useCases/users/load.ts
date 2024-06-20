/*eslint import/no-cycle: [2, { maxDepth: 1 }] -- The depth is allowed in order to reuse cases */

import {type User, type Response} from 'domain/models';
import {Email, Identifier} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class LoadUser {
  private readonly _service = resolve('usersRepository');
  private readonly _identifier: Identifier | Email;

  constructor(identifier: string) {
    try {
      this._identifier = new Identifier(identifier);
    } catch {
      this._identifier = new Email(identifier);
    }
  }

  public async run(): Promise<Response<User>> {
    return await this._service.load(this._identifier);
  }
}
