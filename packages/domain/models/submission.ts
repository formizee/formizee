import {Uid} from './values';

export class Submission {
  private readonly _uid: Uid;
  private readonly _endpoint: Uid;

  private readonly _data: object;
  private readonly _isSpam: boolean;

  private readonly _createdAt: Date;

  constructor(
    uid: string,
    endpoint: string,
    data: object,
    createdAt: Date,
    isSpam?: boolean
  ) {
    this._data = data;
    this._uid = new Uid(uid);
    this._isSpam = isSpam ?? false;
    this._endpoint = new Uid(endpoint);
    this._createdAt = new Date(createdAt);
  }

  get uid(): string {
    return this._uid.value;
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
