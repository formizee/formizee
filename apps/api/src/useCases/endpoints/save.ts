import {Endpoint, Response} from 'domain/models';
import {Uid, Name} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class SaveEndpoint {
  private readonly _repository = resolve('endpointsRepository');
  private readonly _name: Name;
  private readonly _owner: Uid;

  constructor(name: string, owner: string) {
    this._name = new Name(name);
    this._owner = new Uid(owner);
  }

  async run(): Promise<Response<Endpoint>> {
    return await this._repository.save(this._name, this._owner);
  }
}
