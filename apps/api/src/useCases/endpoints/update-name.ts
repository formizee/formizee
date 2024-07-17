import {resolve} from '@/lib/di';
import type {Endpoint, Response} from 'domain/models';
import {Identifier} from 'domain/models/values';

export class UpdateEndpointName {
  private readonly service = resolve('endpointsRepository');
  private readonly _id: Identifier;
  private readonly _name: string;

  constructor(id: string, name: string) {
    this._id = new Identifier(id);
    this._name = name;
  }

  async run(): Promise<Response<Endpoint>> {
    return await this.service.updateName(this._id, this._name);
  }
}
