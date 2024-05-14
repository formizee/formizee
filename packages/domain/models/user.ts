import {Uid, Email, Name} from './values';

export class User {
  private readonly _uid: Uid;
  private readonly _name: Name;
  private readonly _email: Email;
  private readonly _linkedEmails: Array<Email>;

  constructor(uid: string, name: string, email: string) {
    this._uid = new Uid(uid);
    this._name = new Name(name);
    this._email = new Email(email);
    this._linkedEmails = [this._email];
  }

  get uid() {
    return this._uid.value;
  }

  get name() {
    return this._name.value;
  }

  get email() {
    return this._email.value;
  }

  get linkedEmails() {
    return this._linkedEmails;
  }
}
