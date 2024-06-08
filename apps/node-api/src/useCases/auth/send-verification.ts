import {type Response} from 'domain/models';
import {Email} from 'domain/models/values';
import {resolve} from '@/lib/di';

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
