import {type Color, Email, type Icon, Name} from 'domain/models/values';
import {type Endpoint, type Response} from 'domain/models';
import {resolve} from '@/lib/di';

export class SaveEndpoint {
  private readonly _repository = resolve('endpointsRepository');
  private readonly _name: string;
  private readonly _team: Name;
  private readonly _targetEmails: Email[];
  private readonly _color: Color = 'gray';
  private readonly _icon: Icon = 'file';

  constructor(
    name: string,
    team: string,
    targetEmails: string[],
    color?: Color,
    icon?: Icon
  ) {
    this._name = name;
    this._team = new Name(team);
    this._targetEmails = targetEmails.map(email => {
      return new Email(email);
    });
    this._color = color ?? this._color;
    this._icon = icon ?? this._icon;
  }

  async run(): Promise<Response<Endpoint>> {
    return await this._repository.save(
      this._name,
      this._team,
      this._targetEmails,
      this._color,
      this._icon
    );
  }
}
