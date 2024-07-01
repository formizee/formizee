import {type Response, type Member} from 'domain/models';
import {Identifier} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class LoadTeamMember {
  private readonly _repository = resolve('teamsRepository');
  private readonly _member: Identifier;
  private readonly _id: Identifier;

  constructor(id: string, member: string) {
    this._member = new Identifier(member);
    this._id = new Identifier(id);
  }

  async run(): Promise<Response<Member>> {
    return await this._repository.loadMember(this._id, this._member);
  }
}
