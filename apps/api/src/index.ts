import {zEnv, type Env} from '@/lib/enviroment';
import type {ExecutionContext as HonoExecutionContext} from 'hono';
import {newApp} from '@/lib/hono';
import api from '@/v1';

const app = newApp();

app.route('/v1', api);

export default {
  async fetch(req: Request, env: Env, executionCtx) {
    const parsedEnv = zEnv.safeParse(env);
    if (!parsedEnv.success) {
      console.error(`BAD_ENVIRONMENT: ${parsedEnv.error.message}`);
      return Response.json(
        {
          code: 'BAD_ENVIRONMENT',
          message: 'Some environment variables are missing or are invalid',
          errors: parsedEnv.error
        },
        {status: 500}
      );
    }

    const honoExecutionCtx: HonoExecutionContext = {
      waitUntil: executionCtx.waitUntil.bind(executionCtx),
      passThroughOnException:
        executionCtx.passThroughOnException.bind(executionCtx),
      props: {}
    };

    return app.fetch(req, parsedEnv.data, honoExecutionCtx);
  }
} satisfies ExportedHandler<Env>;
