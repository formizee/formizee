/*eslint import/no-cycle: [2, { maxDepth: 1 }] -- The depth is allowed in order to reuse cases */

import {type Response, type Mail} from 'domain/models';
import {type Uid} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class MailSend {
  private readonly _service = resolve('mailService');
  private readonly _mail: Mail;

  constructor(mail: Mail) {
    this._mail = mail;
  }

  public async run(): Promise<Response<Uid>> {
    return await this._service.send(this._mail);
  }
}
