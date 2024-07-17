import {resolve} from '@/lib/di';
import type {Endpoint, Response} from 'domain/models';
import {Identifier} from 'domain/models/values';

export class UpdateEndpointRedirectUrl {
  private readonly _repository = resolve('endpointsRepository');
  private readonly _id: Identifier;
  private readonly _redirectUrl: URL;

  constructor(id: string, redirectUrl: string) {
    this._id = new Identifier(id);
    this._redirectUrl = new URL(redirectUrl);
  }

  async run(): Promise<Response<Endpoint>> {
    return await this._repository.updateRedirectUrl(
      this._id,
      this._redirectUrl
    );
  }
}
