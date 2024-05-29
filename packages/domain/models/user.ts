import {Uid, Email, Name} from './values';

export type UserPermission = 'user' | 'admin';

export class User {
  private readonly _uid: Uid;
  private readonly _name: Name;
  private readonly _email: Email;
  private readonly _forms: Uid[] = [];
  private readonly _isVerified: boolean;
  private readonly _permission: UserPermission;
  private readonly _linkedEmails: Email[] = [];

  constructor(
    uid: string,
    name: string,
    email: string,
    isVerified: boolean,
    permission: UserPermission,
    forms?: string[],
    linkedEmails?: string[]
  ) {
    this._uid = new Uid(uid);
    this._name = new Name(name);
    this._email = new Email(email);
    this._isVerified = isVerified;
    this._permission = permission;

    if (forms && forms.length > 0) {
      forms.forEach(form => {
        this._forms.push(new Uid(form));
      });
    }

    if (linkedEmails) {
      linkedEmails.forEach(email => {
        this._linkedEmails.push(new Email(email));
      });
    } else this._linkedEmails = [this._email];
  }

  get uid(): string {
    return this._uid.value;
  }

  get name(): string {
    return this._name.value;
  }

  get email(): string {
    return this._email.value;
  }

  get isVerified(): boolean {
    return this._isVerified;
  }

  get permission(): UserPermission {
    return this._permission;
  }

  get linkedEmails(): Email[] {
    return this._linkedEmails;
  }

  get linkedForms(): Uid[] {
    return this._forms;
  }
}
