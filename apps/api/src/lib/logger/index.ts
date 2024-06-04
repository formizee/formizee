import {Logtail} from '@logtail/edge';
import {type Context} from 'hono';
import {type Env} from '@/types';

export const reportError = async (error: Error, context: Context): Promise<Response> => {
  const env = context.env as Env;

  if (env.WORKER_ENV === 'dev') {
    return context.text('Internal Server Error.', 500);
  }

  const logger = new Logtail(env.LOGTAIL_SECRET).withExecutionContext(
    context.executionCtx
  );

  const data = JSON.stringify(error, Object.getOwnPropertyNames(error));
  await logger.error(`${error.name}, Click to see more. ${data}`);

  return context.text('Internal Server Error.', 500);
};
