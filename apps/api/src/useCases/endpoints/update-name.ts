import type {Endpoint, Response} from 'domain/models';
import {Identifier} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class UpdateEndpointName {
  private readonly service = resolve('endpointsRepository');
  private readonly _uid: Identifier;
  private readonly _name: string;

  constructor(uid: string, name: string) {
    this._uid = new Identifier(uid);
    this._name = name;
  }

  async run(): Promise<Response<Endpoint>> {
    return await this.service.updateName(this._uid, this._name);
  }
}
