import {type Color, Email, type Icon, Identifier} from './values';

export class Endpoint {
  private readonly _id: Identifier;
  private readonly _name: string;
  private readonly _team: Identifier;

  private readonly _isEnabled: boolean;
  private readonly _emailNotifications: boolean;

  private readonly _redirectUrl: URL;
  private readonly _targetEmails: Email[];

  private readonly _color: Color = 'gray';
  private readonly _icon: Icon = 'file';

  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  constructor(
    uid: string,
    name: string,
    team: string,
    targetEmails: string[],
    redirectUrl: string,
    isEnabled: boolean,
    emailNotifications: boolean,
    color: Color,
    icon: Icon,
    createdAt: Date,
    updatedAt: Date
  ) {
    this._name = name;
    this._id = new Identifier(uid);
    this._team = new Identifier(team);

    this._isEnabled = isEnabled;
    this._emailNotifications = emailNotifications;

    this._targetEmails = targetEmails.map(email => {
      return new Email(email);
    });
    this._redirectUrl = new URL(redirectUrl);

    this._color = color;
    this._icon = icon;

    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  get id(): string {
    return this._id.value;
  }

  get name(): string {
    return this._name;
  }

  get team(): string {
    return this._team.value;
  }

  get isEnabled(): boolean {
    return this._isEnabled;
  }

  get targetEmails(): Email[] {
    return this._targetEmails;
  }

  get redirectUrl(): string {
    return this._redirectUrl.href;
  }

  get emailNotifications(): boolean {
    return this._emailNotifications;
  }

  get color(): Color {
    return this._color;
  }

  get icon(): Icon {
    return this._icon;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
