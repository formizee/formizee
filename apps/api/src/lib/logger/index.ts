import {Logtail} from '@logtail/edge';
import {Context} from 'hono';

export const reportError = (error: Error, context: Context) => {
  if (context.env.WORKER_ENV === 'dev') {
    return context.text('Internal Server Error.', 500);
  }

  const logger = new Logtail(context.env.LOGTAIL_SECRET).withExecutionContext(
    context.executionCtx
  );

  const data = JSON.stringify(error, Object.getOwnPropertyNames(error));
  logger.error(`${error.name}, Click to see more. ${data}`);

  return context.text('Internal Server Error.', 500);
};
