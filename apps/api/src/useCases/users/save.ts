import { Name, Email, Password } from "domain/models/values";
import { User, Response } from "domain/models";
import { resolve } from "@/lib/di";

export class SaveUser {
  private readonly _repository = resolve('usersRepository');
  private readonly _name: Name;
  private readonly _email: Email;
  private readonly _password: Password;

  constructor (name: string, email: string, password: string) {
    this._name = new Name(name);
    this._email = new Email(email);
    this._password = new Password(password);
  }

  async run (): Promise<Response<User>> {
    return await this._repository.save(this._name, this._email, this._password);
  }
}
