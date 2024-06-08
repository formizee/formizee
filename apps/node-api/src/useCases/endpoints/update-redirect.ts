import {type Endpoint, type Response} from 'domain/models';
import {Uid} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class UpdateEndpointRedirectUrl {
  private readonly _repository = resolve('endpointsRepository');
  private readonly _uid: Uid;
  private readonly _redirectUrl: URL;

  constructor(uid: string, redirectUrl: string) {
    this._uid = new Uid(uid);
    this._redirectUrl = new URL(redirectUrl);
  }

  async run(): Promise<Response<Endpoint>> {
    return await this._repository.updateRedirectUrl(
      this._uid,
      this._redirectUrl
    );
  }
}
