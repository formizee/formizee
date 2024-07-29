import {Email, Identifier, type LinkedEmail, Name} from './values';

export class User {
  private readonly _id: Identifier;
  private readonly _name: Name;
  private readonly _email: Email;
  private readonly _isVerified: boolean;
  private readonly _linkedEmails: LinkedEmail[] = [];

  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  constructor(
    id: string,
    name: string,
    email: string,
    isVerified: boolean,
    linkedEmails: LinkedEmail[],
    createdAt: Date,
    updatedAt: Date
  ) {
    this._id = new Identifier(id);
    this._name = new Name(name);
    this._email = new Email(email);
    this._isVerified = isVerified;
    this._linkedEmails = linkedEmails;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  get id(): string {
    return this._id.value;
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

  get linkedEmails(): LinkedEmail[] {
    return this._linkedEmails;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
