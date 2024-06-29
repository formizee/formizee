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

  const service = new LoadUser(user.id);
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
    const service = new UpdateUserName(user.id, request.name);
    const response = await service.run();

    if (!response.ok) {
      return context.json(response.error, response.status as StatusCode);
    }

    data = response.body;
  }

  if (request.email !== undefined) {
    const service = new UpdateUserEmail(user.id, request.email);
    const response = await service.run();

    if (!response.ok) {
      return context.json(response.error, response.status as StatusCode);
    }

    data = response.body;
  }

  if (request.password !== undefined) {
    const service = new UpdateUserPassword(user.id, request.password);
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

    const service = new SaveUserLinkedEmail(user.id, email);
    const response = await service.run();

    return context.json(response.body, response.status as StatusCode);
  }
);

//eslint-disable-next-line -- Drizzle eslint plugin mistake
profile.delete(
  '/linked-emails',
  zValidator('json', DeleteLinkedEmails),
  async context => {
    const {isAuth, user} = await verifySession(context);
    const {email} = context.req.valid('json');

    if (!isAuth || !user) {
      return context.json(
        {error: 'Please, login first in order to do this action.'},
        401
      );
    }

    const service = new DeleteUserLinkedEmail(user.id, email);
    const response = await service.run();

    if (!response.ok) {
      return context.json(response.body, response.status as StatusCode);
    }

    return context.json(
      'The linked email has been deleted.',
      response.status as StatusCode
    );
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

  const service = new DeleteUser(user.id, password);
  const response = await service.run();

  if (!response.ok) {
    return context.json(response.body, response.status as StatusCode);
  }

  return context.json(
    'Your account has been deleted.',
    response.status as StatusCode
  );
});

export default profile;
