import {zEnv, type Env} from '@/lib/enviroment';
import type {ExecutionContext} from 'hono';
import {newApp} from '@/lib/hono';
import api from '@/v1';

const app = newApp();

app.route('/v1', api);

export default {
  async fetch(req: Request, env: Env, executionCtx: ExecutionContext) {
    console.log(env);
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

    return app.fetch(req, parsedEnv.data, executionCtx);
  }
} satisfies ExportedHandler<Env>;
