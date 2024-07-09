import {type Endpoint, type Response} from 'domain/models';
import {Name} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class LoadAllEndpoints {
  private readonly _repository = resolve('endpointsRepository');
  private readonly _team: Name;

  constructor(team: string) {
    this._team = new Name(team);
  }

  async run(): Promise<Response<Endpoint[]>> {
    return await this._repository.loadAll(this._team);
  }
}
