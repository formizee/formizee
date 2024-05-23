import { Email } from "domain/models/values";
import { Response } from "domain/models";
import { resolve } from "@/lib/di";

export class WaitlistJoin {
  private readonly _service = resolve('waitlistService');
  private readonly _email: Email;

  constructor (email: string) {
    this._email = new Email(email);
  }

  public async run(): Promise<Response<true>> {
    return await this._service.join(this._email);
  }
}
