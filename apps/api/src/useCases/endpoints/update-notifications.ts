import {type Endpoint, type Response} from 'domain/models';
import {Identifier} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class UpdateEndpointEmailNotifications {
  private readonly _repository = resolve('endpointsRepository');
  private readonly _uid: Identifier;
  private readonly _emailNotifications: boolean;

  constructor(uid: string, emailNotifications: boolean) {
    this._uid = new Identifier(uid);
    this._emailNotifications = emailNotifications;
  }

  async run(): Promise<Response<Endpoint>> {
    return await this._repository.updateEmailNotifications(
      this._uid,
      this._emailNotifications
    );
  }
}
