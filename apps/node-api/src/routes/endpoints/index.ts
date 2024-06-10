import type {StatusCode} from 'hono/utils/http-status';
import {zValidator} from '@hono/zod-validator';
import {Hono} from 'hono';
import type {Endpoint} from 'domain/models';
import {
  DeleteEndpoint,
  LoadAllEndpoints,
  LoadEndpoint,
  SaveEndpoint,
  UpdateEndpointEmailNotifications,
  UpdateEndpointName,
  UpdateEndpointRedirectUrl,
  UpdateEndpointStatus,
  UpdateEndpointTargetEmail
} from '@/useCases/endpoints';
import {verifySession} from '@/lib/auth';
import {Post, Param, Patch} from './schemas';

export const endpoints = new Hono();

endpoints.get('/', async context => {
  const {isAuth, user} = await verifySession(context);

  if (!isAuth || !user) {
    return context.json(
      {error: 'Please, login first in order to do this action.'},
      401
    );
  }

  const service = new LoadAllEndpoints(user.uid);
  const response = await service.run();

  return context.json(response.body, response.status as StatusCode);
});

endpoints.post('/', zValidator('json', Post), async context => {
  const {isAuth, user} = await verifySession(context);
  const {name} = context.req.valid('json');

  if (!isAuth || !user) {
    return context.json(
      {error: 'Please, login first in order to do this action.'},
      401
    );
  }

  const service = new SaveEndpoint(name, user.uid);
  const response = await service.run();

  return context.json(response.body, response.status as StatusCode);
});

endpoints.get('/:uid', zValidator('param', Param), async context => {
  const {isAuth, user} = await verifySession(context);
  const {uid} = context.req.valid('param');

  if (!isAuth || !user) {
    return context.json(
      {error: 'Please, login first in order to do this action.'},
      401
    );
  }

  const service = new LoadEndpoint(uid);
  const response = await service.run();

  return context.json(response.body, response.status as StatusCode);
});

endpoints.patch(
  '/:uid',
  zValidator('param', Param),
  zValidator('json', Patch),
  async context => {
    const {isAuth, user} = await verifySession(context);
    const request = context.req.valid('json');
    const {uid} = context.req.valid('param');
    let data: Endpoint | null = null;

    if (!isAuth || !user) {
      return context.json(
        {error: 'Please, login first in order to do this action.'},
        401
      );
    }

    if (request.name !== undefined) {
      const service = new UpdateEndpointName(uid, request.name);
      const response = await service.run();

      if (!response.ok) {
        return context.json(response.error, response.status as StatusCode);
      }

      data = response.body;
    }

    if (request.isEnabled !== undefined) {
      const service = new UpdateEndpointStatus(uid, request.isEnabled);
      const response = await service.run();

      if (!response.ok) {
        return context.json(response.error, response.status as StatusCode);
      }

      data = response.body;
    }

    if (request.targetEmail !== undefined) {
      const service = new UpdateEndpointTargetEmail(uid, request.targetEmail);
      const response = await service.run();

      if (!response.ok) {
        return context.json(response.error, response.status as StatusCode);
      }

      data = response.body;
    }

    if (request.redirectUrl !== undefined) {
      const service = new UpdateEndpointRedirectUrl(uid, request.redirectUrl);
      const response = await service.run();

      if (!response.ok) {
        return context.json(response.error, response.status as StatusCode);
      }

      data = response.body;
    }

    if (request.emailNotifications !== undefined) {
      const service = new UpdateEndpointEmailNotifications(
        uid,
        request.emailNotifications
      );
      const response = await service.run();

      if (!response.ok) {
        return context.json(response.error, response.status as StatusCode);
      }

      data = response.body;
    }

    return context.json(data, 200);
  }
);

endpoints.delete('/:uid', zValidator('param', Param), async context => {
  const {isAuth, user} = await verifySession(context);
  const {uid} = context.req.valid('param');

  if (!isAuth || !user) {
    return context.json(
      {error: 'Please, login first in order to do this action.'},
      401
    );
  }

  const service = new DeleteEndpoint(uid);
  const response = await service.run();

  return context.json(response.body, response.status as StatusCode);
});

export default endpoints;
