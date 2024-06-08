import {Uid} from './values';

export class Submission {
  private readonly _uid: Uid;
  private readonly _endpoint: Uid;

  private readonly _data: JSON;
  private readonly _isSpam: boolean;
  private readonly _files: URL[] = [];

  private readonly _createdAt: Date;

  constructor(
    uid: string,
    endpoint: string,
    data: JSON,
    createdAt: Date,
    files?: string[],
    isSpam?: boolean
  ) {
    this._data = data;
    this._uid = new Uid(uid);
    this._isSpam = isSpam ?? false;
    this._endpoint = new Uid(endpoint);
    this._createdAt = new Date(createdAt);

    files?.forEach(file => {
      this._files.push(new URL(file));
    });
  }

  get uid(): string {
    return this._uid.value;
  }

  get data(): unknown {
    return this._data;
  }

  get files(): URL[] {
    return this._files;
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
