import {resolve} from '@/lib/di';
import type {Response} from 'domain/models';
import {Email} from 'domain/models/values';

export class SendVerificationAuth {
  private readonly _service = resolve('authService');
  private readonly _email: Email;

  constructor(email: string) {
    this._email = new Email(email);
  }

  public async run(): Promise<Response<true>> {
    return await this._service.sendVerification(this._email);
  }
}
