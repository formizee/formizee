import {type APIKeyScope, Identifier} from './values';

export class APIKey {
  private readonly _id: Identifier;
  private readonly _scope: APIKeyScope;

  private readonly _userId: Identifier;
  private readonly _teamId: Identifier | undefined = undefined;

  private readonly _lastAccess: Date;
  private readonly _expiresAt: Date;
  private readonly _createdAt: Date;

  constructor(
    id: string,
    scope: APIKeyScope,
    userId: string,
    lastAccess: Date,
    expiresAt: Date,
    createdAt: Date,
    teamId?: string
  ) {
    this._id = new Identifier(id);
    this._scope = scope;

    this._userId = new Identifier(userId);

    if (teamId) {
      this._teamId = new Identifier(teamId);
    }

    this._lastAccess = lastAccess;
    this._expiresAt = expiresAt;
    this._createdAt = createdAt;
  }

  public get id(): string {
    return this._id.value;
  }

  public get scope(): APIKeyScope {
    return this._scope;
  }

  public get userId(): string {
    return this._userId.value;
  }

  public get teamId(): string {
    return this._teamId?.value ?? '';
  }

  public get lastAccess(): Date {
    return this._lastAccess;
  }

  public get expiresAt(): Date {
    return this._expiresAt;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }
}
