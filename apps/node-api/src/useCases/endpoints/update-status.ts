import {type Endpoint, type Response} from 'domain/models';
import {Uid} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class UpdateEndpointStatus {
  private readonly _repository = resolve('endpointsRepository');
  private readonly _uid: Uid;
  private readonly _isEnabled: boolean;

  constructor(uid: string, isEnabled: boolean) {
    this._uid = new Uid(uid);
    this._isEnabled = isEnabled;
  }

  async run(): Promise<Response<Endpoint>> {
    return await this._repository.updateEnabled(this._uid, this._isEnabled);
  }
}
