import {Email, Identifier, Name, type TeamPlan} from './values';

export class Team {
  private readonly _id: Identifier;
  private readonly _name: Name;
  private readonly _plan: TeamPlan;
  private readonly _availableEmails: Email[] = [];

  private readonly _updatedAt: Date;
  private readonly _createdAt: Date;
  private readonly _createdBy: Identifier;

  constructor(
    id: string,
    name: string,
    plan: TeamPlan,
    availableEmails: string[],
    updatedAt: Date,
    createdAt: Date,
    createdBy: string
  ) {
    this._id = new Identifier(id);
    this._name = new Name(name);
    this._plan = plan;

    for (const email of availableEmails) {
      this._availableEmails.push(new Email(email));
    }

    this._updatedAt = updatedAt;
    this._createdAt = createdAt;
    this._createdBy = new Identifier(createdBy);
  }

  get id(): string {
    return this._id.value;
  }

  get name(): string {
    return this._name.value;
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

  get createdBy(): string {
    return this._createdBy.value;
  }
}
