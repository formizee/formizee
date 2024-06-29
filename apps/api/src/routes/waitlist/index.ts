import type {StatusCode} from 'hono/utils/http-status';
import {zValidator} from '@hono/zod-validator';
import {Hono} from 'hono';
import {JoinWaitlist} from '@/useCases/waitlist';
import {joinSchema} from './schema';

export const waitlist = new Hono();

waitlist.post('/join', zValidator('json', joinSchema), async context => {
  const {email} = context.req.valid('json');

  const service = new JoinWaitlist(email);
  const response = await service.run();

  if (!response.ok) {
    return context.json(response.error, response.status as StatusCode);
  }

  return context.json("You're on the Waitlist!", response.status as StatusCode);
});

export default waitlist;
