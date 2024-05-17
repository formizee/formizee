import {Uid, Email, Name} from './values';
import type {Submission} from '.';

export class Endpoint {
  private readonly _uid: Uid;
  private readonly _name: Name;
  private readonly _owner: Uid;
  private readonly _submissions: Submission[];

  private readonly _isEnabled: boolean;
  private readonly _emailNotifications: boolean;

  private readonly _redirectUrl: URL;
  private readonly _targetEmail: Email;

  constructor(
    uid: string,
    name: string,
    owner: string,
    targetEmail: string,
    redirectUrl: string,
    submissions?: Submission[]
  ) {
    this._uid = new Uid(uid);
    this._name = new Name(name);
    this._owner = new Uid(owner);
    this._submissions = submissions ?? [];

    this._isEnabled = true;
    this._emailNotifications = true;

    this._redirectUrl = new URL(redirectUrl);
    this._targetEmail = new Email(targetEmail);
  }

  get uid(): string {
    return this._uid.value;
  }

  get name(): string {
    return this._name.value;
  }

  get owner(): string {
    return this._owner.value;
  }

  get isEnabled(): boolean {
    return this._isEnabled;
  }

  get submissions(): Submission[] {
    return this._submissions;
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
}
