import type {TaskContext} from 'vitest';
import {Harness} from './harness';

import {type StepRequest, type StepResponse, step} from './request';

export class IntegrationHarness extends Harness {
  private constructor(t: TaskContext) {
    super(t);
  }

  static async init(t: TaskContext): Promise<IntegrationHarness> {
    const h = new IntegrationHarness(t);
    await h.seed();
    return h;
  }

  async do<TRequestBody = Request, TResponseBody = Response>(
    req: StepRequest<TRequestBody>
  ): Promise<StepResponse<TResponseBody>> {
    const reqWithUrl: StepRequest<TRequestBody> = {
      ...req,
      url: new URL(req.url, this.env.VAULT_URL).toString()
    };
    return step(reqWithUrl);
  }
  async get<TRes>(
    req: Omit<StepRequest<never>, 'method'>
  ): Promise<StepResponse<TRes>> {
    return this.do<never, TRes>({method: 'GET', ...req});
  }
  async post<TReq, TRes>(
    req: Omit<StepRequest<TReq>, 'method'>
  ): Promise<StepResponse<TRes>> {
    return this.do<TReq, TRes>({method: 'POST', ...req});
  }
  async put<TReq, TRes>(
    req: Omit<StepRequest<TReq>, 'method'>
  ): Promise<StepResponse<TRes>> {
    return this.do<TReq, TRes>({method: 'PUT', ...req});
  }
  async delete<TRes>(
    req: Omit<StepRequest<never>, 'method'>
  ): Promise<StepResponse<TRes>> {
    return this.do<never, TRes>({method: 'DELETE', ...req});
  }
}
