import type {User} from 'domain/models';
import {OpenAPIHono} from '@hono/zod-openapi';
import {userResponse} from '@/lib/models';
import {authentication} from '@/lib/auth';
import {handleValidationErrors} from '@/lib/openapi';
import {
  DeleteUserLinkedEmail,
  SaveUserLinkedEmail,
  UpdateUserPassword,
  UpdateUserEmail,
  UpdateUserName,
  DeleteUser,
  LoadUser
} from '@/useCases/users';
import {
  deleteProfileLinkedEmailsRoute,
  postProfileLinkedEmailsRoute,
  deleteProfileRoute,
  patchProfileRoute,
  getProfileRoute
} from './routes';

export const profile = new OpenAPIHono({
  defaultHook: (result, context) => {
    if (!result.success) {
      const error = handleValidationErrors(result.error);
      return context.json(error, 400);
    }
  }
});

profile.use(getProfileRoute.getRoutingPath(), authentication);
profile.openapi(getProfileRoute, async context => {
  const {user} = context.env?.session as {user: string};

  const service = new LoadUser(user);
  const response = await service.run();

  const error = response.status === 401 || response.status === 404;
  if (error) {
    return context.json(response.error, response.status);
  }

  return context.json(userResponse(response.body), 200);
});

profile.use(patchProfileRoute.getRoutingPath(), authentication);
profile.openapi(patchProfileRoute, async context => {
  const {user} = context.env?.session as {user: string};
  const request = context.req.valid('json');
  let data: User | null = null;

  if (request.name !== undefined) {
    const service = new UpdateUserName(user, request.name);
    const response = await service.run();

    const error =
      response.status === 401 ||
      response.status === 404 ||
      response.status === 409;
    if (error) {
      return context.json(response.error, response.status);
    }

    data = response.body;
  }

  if (request.email !== undefined) {
    const service = new UpdateUserEmail(user, request.email);
    const response = await service.run();

    const error =
      response.status === 401 ||
      response.status === 404 ||
      response.status === 409;
    if (error) {
      return context.json(response.error, response.status);
    }

    data = response.body;
  }

  if (request.password !== undefined) {
    const service = new UpdateUserPassword(user, request.password);
    const response = await service.run();

    const error =
      response.status === 401 ||
      response.status === 404 ||
      response.status === 409;
    if (error) {
      return context.json(response.error, response.status);
    }

    data = response.body;
  }

  const hasEmptyValues =
    request.name === undefined &&
    request.email === undefined &&
    request.password === undefined;

  if (hasEmptyValues || data === null) {
    return context.json(
      {
        name: 'Bad request',
        description:
          "At least provide one of the following fields: 'name', 'email', 'password'"
      },
      400
    );
  }

  return context.json(userResponse(data), 200);
});

profile.use(postProfileLinkedEmailsRoute.getRoutingPath(), authentication);
profile.openapi(postProfileLinkedEmailsRoute, async context => {
  const {user} = context.env?.session as {user: string};
  const {email} = context.req.valid('json');

  const service = new SaveUserLinkedEmail(user, email);
  const response = await service.run();

  const error =
    response.status === 401 ||
    response.status === 403 ||
    response.status === 404 ||
    response.status === 409;
  if (error) {
    return context.json(response.error, response.status);
  }

  return context.json(userResponse(response.body), 201);
});

profile.use(deleteProfileLinkedEmailsRoute.getRoutingPath(), authentication);
profile.openapi(deleteProfileLinkedEmailsRoute, async context => {
  const {user} = context.env?.session as {user: string};
  const {email} = context.req.valid('param');

  const service = new DeleteUserLinkedEmail(user, email);
  const response = await service.run();

  const error =
    response.status === 401 ||
    response.status === 404 ||
    response.status === 409;
  if (error) {
    return context.json(response.error, response.status);
  }

  return context.json(userResponse(response.body), 204);
});

profile.use(deleteProfileRoute.getRoutingPath(), authentication);
profile.openapi(deleteProfileRoute, async context => {
  const {user} = context.env?.session as {user: string};
  const {password} = context.req.valid('json');

  const service = new DeleteUser(user, password);
  const response = await service.run();

  const error = response.status === 401 || response.status === 404;
  if (error) {
    return context.json(response.error, response.status);
  }

  return context.json('Your account has been deleted.', 204);
});

export default profile;
