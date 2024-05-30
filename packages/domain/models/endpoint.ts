import {Uid, Email} from './values';

export class Endpoint {
  private readonly _uid: Uid;
  private readonly _name: string;
  private readonly _owner: Uid;
  private readonly _submissions: Uid[] = [];

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
    submissions?: string[]
  ) {
    this._name = name;
    this._uid = new Uid(uid);
    this._owner = new Uid(owner);

    if (submissions && submissions?.length > 0) {
      submissions.forEach(submission => {
        this._submissions.push(new Uid(submission));
      });
    }

    this._isEnabled = true;
    this._emailNotifications = true;

    this._redirectUrl = new URL(
      redirectUrl !== ''
        ? redirectUrl
        : `https://formizee.com/f/${this._uid}/thanks`
    );
    this._targetEmail = new Email(targetEmail);
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

  get submissions(): Uid[] {
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
