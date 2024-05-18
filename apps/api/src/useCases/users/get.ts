import { Uid } from "domain/models/values";
import { User } from "domain/models";
import { resolve } from "@/lib/di";

export class GetUserUseCase {
  private readonly _repository = resolve('usersRepository');
  private readonly _uid: Uid;

  constructor (uid: string) {
    this._uid = new Uid(uid);
  }

  async run (): Promise<User> {
    return await this._repository.get(this._uid);
  }
}
