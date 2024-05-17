import {Uid} from './values';

export class Submission {
  private readonly _uid: Uid;
  private readonly _date: Date;
  private readonly _form: FormData;

  constructor(uid: string, date: string, form: FormData) {
    this._uid = new Uid(uid);
    this._date = new Date(date);
    this._form = form;
  }

  get uid(): string {
    return this._uid.value;
  }

  get date(): Date {
    return this._date;
  }

  get form(): FormData {
    return this._form;
  }
}
