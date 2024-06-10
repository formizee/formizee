import {Uid, Email, Name, LinkedEmail} from './values';

export type UserPermission = 'user' | 'admin';

export class User {
  private readonly _uid: Uid;
  private readonly _name: Name;
  private readonly _email: Email;
  private readonly _isVerified: boolean;
  private readonly _permission: UserPermission;

  private readonly _forms: Uid[] = [];
  private readonly _linkedEmails: LinkedEmail[] = [];

  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  constructor(
    uid: string,
    name: string,
    email: string,
    isVerified: boolean,
    permission: UserPermission,
    createdAt: Date,
    updatedAt: Date,
    forms?: string[],
    linkedEmails?: {email: string; isVerified: boolean}[]
  ) {
    this._uid = new Uid(uid);
    this._name = new Name(name);
    this._email = new Email(email);
    this._isVerified = isVerified;
    this._permission = permission;

    if (forms && forms.length > 0) {
      forms.forEach(item => {
        this._forms.push(new Uid(item));
      });
    }

    if (!linkedEmails) {
      this._linkedEmails = [new LinkedEmail(this._email.value, true)];
    }

    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
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

  get linkedEmails(): LinkedEmail[] {
    return this._linkedEmails;
  }

  get linkedForms(): Uid[] {
    return this._forms;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
