import {Identifier, Email, TeamPlan} from './values';

export class Team {
  private readonly _id: Identifier;
  private readonly _name: string;
  private readonly _plan: TeamPlan;
  private readonly _availableEmails: Email[] = [];

  private readonly _updatedAt: Date;
  private readonly _createdAt: Date;

  constructor(
    id: string,
    name: string,
    plan: TeamPlan,
    availableEmails: string[],
    updatedAt: Date,
    createdAt: Date
  ) {
    this._id = new Identifier(id);
    this._name = name;
    this._plan = plan;

    availableEmails.forEach(email => {
      this._availableEmails.push(new Email(email));
    });

    this._updatedAt = updatedAt;
    this._createdAt = createdAt;
  }

  get id(): string {
    return this._id.value;
  }

  get name(): string {
    return this._name;
  }

  get plan(): TeamPlan {
    return this._plan;
  }

  get availableEmails(): Email[] {
    return this._availableEmails;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
