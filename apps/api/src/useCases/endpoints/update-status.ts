import {resolve} from '@/lib/di';
import type {Endpoint, Response} from 'domain/models';
import {Identifier} from 'domain/models/values';

export class UpdateEndpointStatus {
  private readonly _repository = resolve('endpointsRepository');
  private readonly _id: Identifier;
  private readonly _isEnabled: boolean;

  constructor(id: string, isEnabled: boolean) {
    this._id = new Identifier(id);
    this._isEnabled = isEnabled;
  }

  async run(): Promise<Response<Endpoint>> {
    return await this._repository.updateEnabled(this._id, this._isEnabled);
  }
}
