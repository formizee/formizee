import {Identifier} from 'domain/models/values';
import {type Response} from 'domain/models';
import {resolve} from '@/lib/di';

export class DeleteUser {
  private readonly _repository = resolve('usersRepository');
  private readonly _password: string;
  private readonly _id: Identifier;

  constructor(id: string, password: string) {
    this._password = password;
    this._id = new Identifier(id);
  }

  async run(): Promise<Response<true>> {
    //eslint-disable-next-line -- Drizzle eslint plugin mistake
    return await this._repository.delete(this._id, this._password);
  }
}
