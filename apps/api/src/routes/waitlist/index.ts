import {handleValidationErrors} from '@/lib/openapi';
import {JoinWaitlist} from '@/useCases/waitlist';
import {OpenAPIHono} from '@hono/zod-openapi';
import {postWaitlistRoute} from './routes';

export const waitlist = new OpenAPIHono();

waitlist.openapi(
  postWaitlistRoute,
  async context => {
    const {email} = context.req.valid('json');

    const service = new JoinWaitlist(email);
    const response = await service.run();

    if (response.status === 409) {
      return context.json(response.error, response.status);
    }

    return context.json("You're on the Waitlist!", 201);
  },
  (result, context) => {
    if (!result.success) {
      const error = handleValidationErrors(result.error);
      return context.json(error, 400);
    }
  }
);
