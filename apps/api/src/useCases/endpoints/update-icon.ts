import type {Endpoint, Response} from 'domain/models';
import {type Icon, Identifier} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class UpdateEndpointIcon {
  private readonly service = resolve('endpointsRepository');
  private readonly _id: Identifier;
  private readonly _icon: Icon;

  constructor(id: string, icon: Icon) {
    this._id = new Identifier(id);
    this._icon = icon;
  }

  async run(): Promise<Response<Endpoint>> {
    return await this.service.updateIcon(this._id, this._icon);
  }
}
