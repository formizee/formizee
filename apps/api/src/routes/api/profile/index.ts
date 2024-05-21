import {verifySession} from '@/lib/auth/dal';
import {
  DeleteUser,
  LoadUser,
  UpdateUserEmail,
  UpdateUserLinkedEmails,
  UpdateUserName,
  UpdateUserPassword
} from '@/useCases/users';
import {Hono} from 'hono';
import {StatusCode} from 'hono/utils/http-status';

const profileRouter = new Hono();

profileRouter.get('/', async context => {
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

profileRouter.put('/name', async context => {
  const {name} = await context.req.json<{name: string}>();

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

profileRouter.put('/email', async context => {
  const {email} = await context.req.json<{email: string}>();

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

profileRouter.put('/password', async context => {
  const {password} = await context.req.json<{password: string}>();

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

profileRouter.put('/linked-emails', async context => {
  const {emails} = await context.req.json<{emails: string[]}>();

  const {isAuth, user} = await verifySession(context);
  if (!isAuth || !user)
    return context.json(
      {error: 'Please, login first in order to do this action'},
      401
    );

  const service = new UpdateUserLinkedEmails(user, emails);
  const response = await service.run();

  return context.json(response.error ?? 'OK', response.status as StatusCode);
});

profileRouter.delete('/', async context => {
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

export default profileRouter;
