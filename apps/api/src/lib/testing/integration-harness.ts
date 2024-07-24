import type {TaskContext} from 'vitest';
import {env} from '@/lib/enviroment';
import {Harness} from './harness';
import type {App} from '../hono';

import {type StepRequest, type StepResponse, fetchRoute} from './request';

export class IntegrationHarness extends Harness {
  public readonly baseUrl: string;
  private readonly app: App;

  private constructor(t: TaskContext, app: App) {
    super(t);
    this.app = app;
    this.baseUrl = env.API_URL;
  }

  static async init(t: TaskContext, app: App): Promise<IntegrationHarness> {
    const h = new IntegrationHarness(t, app);
    await h.seed();
    return h;
  }

  async do<TRequestBody = Request, TResponseBody = Response>(
    req: StepRequest<TRequestBody>
  ): Promise<StepResponse<TResponseBody>> {
    //const reqWithUrl: StepRequest<TRequestBody> = req;
    return fetchRoute(this.app, req);
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
