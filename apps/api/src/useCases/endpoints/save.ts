import {type Endpoint, type Response} from 'domain/models';
import {Uid} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class SaveEndpoint {
  private readonly _repository = resolve('endpointsRepository');
  private readonly _name: string;
  private readonly _owner: Uid;

  constructor(name: string, owner: string) {
    this._name = name;
    this._owner = new Uid(owner);
  }

  async run(): Promise<Response<Endpoint>> {
    return await this._repository.save(this._name, this._owner);
  }
}
