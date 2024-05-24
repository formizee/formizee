type ResponseOptions = {
  status: number;
};

export class Response<T> {
  private readonly _ok: boolean;
  private readonly _status: number;
  private readonly _body: T | object;

  constructor(body: T | object, options: ResponseOptions) {
    this._body = body;
    this._status = options.status;
    this._ok = this._isSuccessStatusCode(options.status);
  }

  private _isSuccessStatusCode(status: number): boolean {
    return status >= 200 && status < 300;
  }

  static success<T>(body: T, status = 200): Response<T> {
    return new Response<T>(body, {status});
  }

  static error<T>(message: string, status = 500): Response<T> {
    return new Response<T>({error: message}, {status});
  }

  toJSON() {
    return this._ok ? {data: this._body} : {error: this._body};
  }

  get status(): number {
    return this._status;
  }

  get ok(): boolean {
    return this._ok;
  }

  get body(): T {
    return this._body as T;
  }

  get error(): object {
    return this._body as object;
  }
}
