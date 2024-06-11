import {type Response} from 'domain/models';
import {resolve} from '@/lib/di';

export class VerifyLinkedEmail {
  private readonly _service = resolve('authService');
  private readonly _token: string;

  constructor(jwtToken: string) {
    this._token = jwtToken;
  }

  public async run(): Promise<Response<true>> {
    return await this._service.verifyLinkedEmail(this._token);
  }
}
