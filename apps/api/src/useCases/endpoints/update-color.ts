import {resolve} from '@/lib/di';
import type {Endpoint, Response} from 'domain/models';
import {type Color, Identifier} from 'domain/models/values';

export class UpdateEndpointColor {
  private readonly service = resolve('endpointsRepository');
  private readonly _id: Identifier;
  private readonly _color: Color;

  constructor(id: string, color: Color) {
    this._id = new Identifier(id);
    this._color = color;
  }

  async run(): Promise<Response<Endpoint>> {
    return await this.service.updateColor(this._id, this._color);
  }
}
