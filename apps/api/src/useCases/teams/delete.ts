import {type Response} from 'domain/models';
import {Identifier} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class DeleteTeam {
  private readonly _repository = resolve('teamsRepository');
  private readonly _id: Identifier;

  constructor(id: string) {
    this._id = new Identifier(id);
  }

  async run(): Promise<Response<true>> {
    //eslint-disable-next-line -- Drizzle eslint plugin mistake
    return await this._repository.delete(this._id);
  }
}
