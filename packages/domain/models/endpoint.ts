import {Uid, Email} from './values';

export class Endpoint {
  private readonly _uid: Uid;
  private readonly _name: string;
  private readonly _owner: Uid;

  private readonly _isEnabled: boolean;
  private readonly _emailNotifications: boolean;

  private readonly _redirectUrl: URL;
  private readonly _targetEmail: Email;

  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  constructor(
    uid: string,
    name: string,
    owner: string,
    targetEmail: string,
    redirectUrl: string,
    createdAt: string,
    updatedAt: string
  ) {
    this._name = name;
    this._uid = new Uid(uid);
    this._owner = new Uid(owner);

    this._isEnabled = true;
    this._emailNotifications = true;

    this._redirectUrl = new URL(
      redirectUrl !== ''
        ? redirectUrl
        : `https://formizee.com/f/${this._uid.value}/thanks`
    );
    this._targetEmail = new Email(targetEmail);

    this._createdAt = new Date(createdAt);
    this._updatedAt = new Date(updatedAt);
  }

  get uid(): string {
    return this._uid.value;
  }

  get name(): string {
    return this._name;
  }

  get owner(): string {
    return this._owner.value;
  }

  get isEnabled(): boolean {
    return this._isEnabled;
  }

  get targetEmail(): string {
    return this._targetEmail.value;
  }

  get redirectUrl(): string {
    return this._redirectUrl.href;
  }

  get emailNotifications(): boolean {
    return this._emailNotifications;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
