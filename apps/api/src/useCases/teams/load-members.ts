import {type Response, type Member} from 'domain/models';
import {Identifier} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class LoadTeamMembers {
  private readonly _repository = resolve('teamsRepository');
  private readonly _id: Identifier;

  constructor(id: string) {
    this._id = new Identifier(id);
  }

  async run(): Promise<Response<Member[]>> {
    return await this._repository.loadMembers(this._id);
  }
}
