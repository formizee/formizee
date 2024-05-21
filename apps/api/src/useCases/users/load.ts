import { User, Response } from "domain/models";
import { Uid } from "domain/models/values";
import { resolve } from "@/lib/di";

export class LoadUser {
  private readonly _service = resolve('usersRepository');
  private readonly _uid: Uid;

  constructor(uid: string) {
    this._uid = new Uid(uid);
  }

  public async run (): Promise<Response<User>> {
    return await this._service.load(this._uid);
  }
}
