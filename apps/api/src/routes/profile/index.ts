import {StatusCode} from 'hono/utils/http-status';
import {Hono} from 'hono';
import {
  DeleteUser,
  LoadUser,
  UpdateUserEmail,
  UpdateUserLinkedEmails,
  UpdateUserName,
  UpdateUserPassword
} from '@/useCases/users';

import {
  emailSchema,
  linkedEmailsSchema,
  nameSchema,
  passwordSchema
} from './schema';
/* @ts-ignore-next-line */
import {zValidator} from '@hono/zod-validator';
import {verifySession} from '@/lib/auth';

const router = new Hono();

/*
router.get('/', async context => {
  const {isAuth, user} = await verifySession(context);
  if (!isAuth || !user)
    return context.json(
      {error: 'Please, login first in order to do this action'},
      401
    );

  const service = new LoadUser(user);
  const response = await service.run();

  return context.json(response.body, response.status as StatusCode);
});

router.put('/name', zValidator('json', nameSchema), async context => {
  const {name} = context.req.valid('json');

  const {isAuth, user} = await verifySession(context);
  if (!isAuth || !user)
    return context.json(
      {error: 'Please, login first in order to do this action'},
      401
    );

  const service = new UpdateUserName(user, name);
  const response = await service.run();

  return context.json(response.error ?? 'OK', response.status as StatusCode);
});

router.put('/email', zValidator('json', emailSchema), async context => {
  const {email} = context.req.valid('json');

  const {isAuth, user} = await verifySession(context);
  if (!isAuth || !user)
    return context.json(
      {error: 'Please, login first in order to do this action'},
      401
    );

  const service = new UpdateUserEmail(user, email);
  const response = await service.run();

  return context.json(response.error ?? 'OK', response.status as StatusCode);
});
*/

router.put('/password', zValidator('json', passwordSchema), async context => {
  const {password} = context.req.valid('json');

  const {isAuth, user} = await verifySession(context);
  if (!isAuth || !user)
    return context.json(
      {error: 'Please, login first in order to do this action'},
      401
    );

  const service = new UpdateUserPassword(user, password);
  const response = await service.run();

  return context.json(response.error ?? 'OK', response.status as StatusCode);
});

/*
router.put(
  '/linked-emails',
  zValidator('json', linkedEmailsSchema),
  async context => {
    const {emails} = context.req.valid('json');

    const {isAuth, user} = await verifySession(context);
    if (!isAuth || !user)
      return context.json(
        {error: 'Please, login first in order to do this action'},
        401
      );

    const service = new UpdateUserLinkedEmails(user, emails);
    const response = await service.run();

    return context.json(response.error ?? 'OK', response.status as StatusCode);
  }
);

router.delete('/', async context => {
  const {isAuth, user} = await verifySession(context);
  if (!isAuth || !user)
    return context.json(
      {error: 'Please, login first in order to do this action'},
      401
    );

  const service = new DeleteUser(user);
  const response = await service.run();

  return context.json(response.error ?? 'OK', response.status as StatusCode);
});
*/

export default router;
