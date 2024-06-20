import { Identifier } from './values';

export class Submission {
  private readonly _id: Identifier;
  private readonly _endpoint: Identifier;

  private readonly _data: object;
  private readonly _isSpam: boolean;

  private readonly _createdAt: Date;

  constructor(
    id: string,
    endpoint: string,
    data: object,
    createdAt: Date,
    isSpam?: boolean
  ) {
    this._data = data;
    this._id = new Identifier(id);
    this._isSpam = isSpam ?? false;
    this._endpoint = new Identifier(endpoint);
    this._createdAt = new Date(createdAt);
  }

  get id(): string {
    return this._id.value;
  }

  get data(): unknown {
    return this._data;
  }

  get isSpam(): boolean {
    return this._isSpam;
  }

  get endpoint(): string {
    return this._endpoint.value;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
