import {integrationTestEnv} from './enviroment';
import type {TaskContext} from 'vitest';
import {Harness} from './harness';

import {type StepRequest, type StepResponse, step} from './request';

export class IntegrationHarness extends Harness {
  public readonly apiUrl: string;
  public readonly webUrl: string;
  public readonly docsUrl: string;
  public readonly vaultUrl: string;

  private constructor(t: TaskContext) {
    const env = integrationTestEnv.parse(process.env);

    super(t);
    this.apiUrl = env.API_URL;
    this.webUrl = env.WEB_URL;
    this.docsUrl = env.DOCS_URL;
    this.vaultUrl = env.VAULT_URL;
  }

  static async init(t: TaskContext): Promise<IntegrationHarness> {
    const h = new IntegrationHarness(t);
    await h.seed();
    await h.seedvault();
    return h;
  }

  async do<TRequestBody = Request, TResponseBody = Response>(
    req: StepRequest<TRequestBody>
  ): Promise<StepResponse<TResponseBody>> {
    const reqWithUrl: StepRequest<TRequestBody> = {
      ...req,
      url: new URL(req.url, this.apiUrl).toString()
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
