type Status = 200 | 201 | 202 | 204 | 400 | 401 | 403 | 404 | 409 | 413 | 500;

interface ResponseOptions {
  status: Status;
}

export class Response<T> {
  private readonly _ok: boolean;
  private readonly _status: Status;
  private readonly _body: T | object;

  constructor(body: T | object, options: ResponseOptions) {
    this._body = body;
    this._status = options.status;
    this._ok = this._isSuccessStatusCode(options.status);
  }

  private _isSuccessStatusCode(status: number): boolean {
    return status >= 200 && status < 300;
  }

  static success<T>(body: T, status: Status = 200): Response<T> {
    return new Response<T>(body, {status});
  }

  static error<T>(
    error: {name: string; description: string},
    status: Status = 500
  ): Response<T> {
    return new Response<T>(error, {status});
  }

  get status(): Status {
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
