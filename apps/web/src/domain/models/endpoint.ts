import {Uid, Email} from './values';
import {Submission} from '.';

export class Endpoint {
  private readonly _uid: Uid;
  private readonly _owner: Uid;
  private readonly _submissions: Array<Submission>;

  private readonly _isEnabled: boolean;
  private readonly _emailNotifications: boolean;

  private readonly _redirectUrl: URL;
  private readonly _targetEmail: Email;

  constructor(
    uid: string,
    owner: string,
    targetEmail: string,
    redirectUrl: string,
    submissions?: Array<Submission>
  ) {
    this._uid = new Uid(uid);
    this._owner = new Uid(owner);
    this._submissions = submissions ?? [];

    this._isEnabled = true;
    this._emailNotifications = true;

    this._redirectUrl = new URL(redirectUrl);
    this._targetEmail = new Email(targetEmail);
  }

  get uid() {
    return this._uid.value;
  }

  get owner() {
    return this._owner.value;
  }

  get isEnabled() {
    return this._isEnabled;
  }

  get submissions() {
    return this._submissions;
  }

  get targetEmail() {
    return this._targetEmail.value;
  }

  get redirectUrl() {
    return this._redirectUrl.href;
  }

  get emailNotifications() {
    return this._emailNotifications;
  }
}
