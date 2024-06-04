/*eslint import/no-cycle: [2, { maxDepth: 1 }] -- The depth is allowed in order to reuse cases */

import {Uid, Email} from 'domain/models/values';
import {type Response} from 'domain/models';
import {resolve} from '@/lib/di';

export class UpdateUserLinkedEmails {
  private readonly _repository = resolve('usersRepository');
  private readonly _emails: Email[] = [];
  private readonly _uid: Uid;

  constructor(uid: string, linkedEmails: string[]) {
    linkedEmails.forEach(email => {
      this._emails.push(new Email(email));
    });

    this._uid = new Uid(uid);
  }

  async run(): Promise<Response<true>> {
    return await this._repository.updateLinkedEmails(this._uid, this._emails);
  }
}
