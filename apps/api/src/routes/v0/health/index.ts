import {OpenAPIHono} from '@hono/zod-openapi';
import {getHealthRoute} from './routes';

export const health = new OpenAPIHono();

health.openapi(
  getHealthRoute,
  context => context.text('OK', 200),
  (result, context) => {
    if (!result.success) {
      return context.json(
        {
          name: result.error.name,
          description: result.error.message
        },
        500
      );
    }
  }
);
