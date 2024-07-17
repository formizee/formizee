import {resolve} from '@/lib/di';
import type {Endpoint, Response} from 'domain/models';
import {Identifier} from 'domain/models/values';

export class UpdateEndpointEmailNotifications {
  private readonly _repository = resolve('endpointsRepository');
  private readonly _id: Identifier;
  private readonly _emailNotifications: boolean;

  constructor(id: string, emailNotifications: boolean) {
    this._id = new Identifier(id);
    this._emailNotifications = emailNotifications;
  }

  async run(): Promise<Response<Endpoint>> {
    return await this._repository.updateEmailNotifications(
      this._id,
      this._emailNotifications
    );
  }
}
