import {type Team, type Response} from 'domain/models';
import {Identifier} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class LoadUserLinkedTeams {
  private readonly _service = resolve('usersRepository');
  private readonly _identifier: Identifier;

  constructor(identifier: string) {
    this._identifier = new Identifier(identifier);
  }

  public async run(): Promise<Response<Team[]>> {
    return await this._service.loadLinkedTeams(this._identifier);
  }
}
