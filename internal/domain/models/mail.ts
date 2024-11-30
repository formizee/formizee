import {Email} from './values';

export class Mail {
  private readonly _name: string;
  private readonly _from: Email;
  private readonly _to: Email;
  private readonly _subject: string;
  private readonly _html: string;

  constructor(
    name: string,
    from: string,
    to: string,
    subject: string,
    html: string
  ) {
    this._name = name;
    this._from = new Email(from);
    this._to = new Email(to);
    this._subject = subject;
    this._html = html;
  }

  get name(): string {
    return this._name;
  }

  get from(): string {
    return this._from.value;
  }

  get to(): string {
    return this._to.value;
  }

  get subject(): string {
    return this._subject;
  }

  get html(): string {
    return this._html;
  }
}
