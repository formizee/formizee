import {Uid, Email, Name} from './values';

export type UserPermission = 'user' | 'admin';

export class User {
  private readonly _uid: Uid;
  private readonly _name: Name;
  private readonly _email: Email;
  private readonly _isVerified: boolean;
  private readonly _permission: UserPermission;

  private readonly _forms: Uid[] = [];
  private readonly _linkedEmails: Email[] = [];

  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  constructor(
    uid: string,
    name: string,
    email: string,
    isVerified: boolean,
    permission: UserPermission,
    createdAt: string,
    updatedAt: string,
    forms?: string[],
    linkedEmails?: string[]
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

    if (linkedEmails) {
      linkedEmails.forEach(item => {
        this._linkedEmails.push(new Email(item));
      });
    } else this._linkedEmails = [this._email];

    this._createdAt = new Date(createdAt);
    this._updatedAt = new Date(updatedAt);
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

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
