/*eslint import/no-cycle: [2, { maxDepth: 1 }] -- The depth is allowed in order to reuse cases */

import {Uid, Email} from 'domain/models/values';
import {type Response} from 'domain/models';
import {resolve} from '@/lib/di';

export class UpdateUserEmail {
  private readonly _repository = resolve('usersRepository');
  private readonly _email: Email;
  private readonly _uid: Uid;

  constructor(uid: string, newEmail: string) {
    this._email = new Email(newEmail);
    this._uid = new Uid(uid);
  }

  async run(): Promise<Response<true>> {
    return await this._repository.updateEmail(this._uid, this._email);
  }
}
