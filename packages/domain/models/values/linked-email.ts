import {Email} from './email';

export class LinkedEmail {
  readonly _email: Email;
  readonly _isVerified: boolean;

  constructor(
    readonly email: string,
    readonly isVerified: boolean
  ) {
    this._email = new Email(email);
    this._isVerified = isVerified;
  }
}
