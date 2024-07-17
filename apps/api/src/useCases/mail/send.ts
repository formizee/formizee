import {resolve} from '@/lib/di';
import type {Mail, Response} from 'domain/models';
import type {Identifier} from 'domain/models/values';

export class SendMail {
  private readonly _service = resolve('mailService');
  private readonly _mail: Mail;

  constructor(mail: Mail) {
    this._mail = mail;
  }

  public run(): Response<Identifier> {
    return this._service.send(this._mail);
  }
}
