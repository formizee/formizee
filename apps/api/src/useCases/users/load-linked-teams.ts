import {resolve} from '@/lib/di';
import type {Response, Team} from 'domain/models';
import {Identifier} from 'domain/models/values';

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
