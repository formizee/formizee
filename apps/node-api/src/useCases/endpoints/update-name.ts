import type {Endpoint, Response} from 'domain/models';
import {Uid} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class UpdateEndpointName {
  private readonly service = resolve('endpointsRepository');
  private readonly _uid: Uid;
  private readonly _name: string;

  constructor(uid: string, name: string) {
    this._uid = new Uid(uid);
    this._name = name;
  }

  async run(): Promise<Response<Endpoint>> {
    return await this.service.updateName(this._uid, this._name);
  }
}
