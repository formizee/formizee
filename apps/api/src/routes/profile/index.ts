import type {User} from 'domain/models';
import {zValidator} from '@hono/zod-validator';
import type {StatusCode} from 'hono/utils/http-status';
import {Hono} from 'hono';
import {verifySession} from '@/lib/auth';
import {
  DeleteUser,
  DeleteUserLinkedEmail,
  LoadUser,
  SaveUserLinkedEmail,
  UpdateUserEmail,
  UpdateUserName,
  UpdateUserPassword
} from '@/useCases/users';
import {Patch, Delete, PostLinkedEmails, DeleteLinkedEmails} from './schemas';

export const profile = new Hono();

profile.get('/', async context => {
  const {isAuth, user} = await verifySession(context);

  if (!isAuth || !user) {
    return context.json(
      {error: 'Please, login first in order to do this action.'},
      401
    );
  }

  const service = new LoadUser(user.uid);
  const response = await service.run();

  return context.json(response.body, response.status as StatusCode);
});

profile.patch('/', zValidator('json', Patch), async context => {
  const {isAuth, user} = await verifySession(context);
  const request = context.req.valid('json');
  let data: User | null = null;

  if (!isAuth || !user) {
    return context.json(
      {error: 'Please, login first in order to do this action.'},
      401
    );
  }

  if (request.name !== undefined) {
    const service = new UpdateUserName(user.uid, request.name);
    const response = await service.run();

    if (!response.ok) {
      return context.json(response.error, response.status as StatusCode);
    }

    data = response.body;
  }

  if (request.email !== undefined) {
    const service = new UpdateUserEmail(user.uid, request.email);
    const response = await service.run();

    if (!response.ok) {
      return context.json(response.error, response.status as StatusCode);
    }

    data = response.body;
  }

  if (request.password !== undefined) {
    const service = new UpdateUserPassword(user.uid, request.password);
    const response = await service.run();

    if (!response.ok) {
      return context.json(response.error, response.status as StatusCode);
    }

    data = response.body;
  }

  return context.json(data, 200);
});

profile.post(
  '/linked-emails',
  zValidator('json', PostLinkedEmails),
  async context => {
    const {isAuth, user} = await verifySession(context);
    const {email} = context.req.valid('json');

    if (!isAuth || !user) {
      return context.json(
        {error: 'Please, login first in order to do this action.'},
        401
      );
    }

    const service = new SaveUserLinkedEmail(user.uid, email);
    const response = await service.run();

    return context.json(response.body, response.status as StatusCode);
  }
);

//eslint-disable-next-line -- Drizzle eslint plugin mistake
profile.delete(
  '/linked-emails/:email',
  zValidator('param', DeleteLinkedEmails),
  async context => {
    const {isAuth, user} = await verifySession(context);
    const {email} = context.req.valid('param');

    if (!isAuth || !user) {
      return context.json(
        {error: 'Please, login first in order to do this action.'},
        401
      );
    }

    const service = new DeleteUserLinkedEmail(user.uid, email);
    const response = await service.run();

    return context.json(response.body, response.status as StatusCode);
  }
);

//eslint-disable-next-line -- Drizzle eslint plugin mistake
profile.delete('/', zValidator('json', Delete), async context => {
  const {isAuth, user} = await verifySession(context);
  const {password} = context.req.valid('json');

  if (!isAuth || !user) {
    return context.json(
      {error: 'Please, login first in order to do this action.'},
      401
    );
  }

  const service = new DeleteUser(user.uid, password);
  const response = await service.run();

  return context.json(response.body, response.status as StatusCode);
});

export default profile;
