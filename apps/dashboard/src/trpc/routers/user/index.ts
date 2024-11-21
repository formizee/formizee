import emailsRouter from './emails';
import updateRouter from './update';
import {router} from '@/trpc';

// Procedures
import {getUser} from './get';

export const userRouter = router({
  emails: emailsRouter,
  update: updateRouter,
  get: getUser
});
