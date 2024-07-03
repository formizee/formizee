import {OpenAPIHono} from '@hono/zod-openapi';
import type {Endpoint} from 'domain/models';
import {handleValidationErrors} from '@/lib/openapi';
import {endpointResponse} from '@/lib/models';
import {authentication} from '@/lib/auth';
import {
  DeleteEndpoint,
  LoadAllEndpoints,
  LoadEndpoint,
  SaveEndpoint,
  UpdateEndpointEmailNotifications,
  UpdateEndpointName,
  UpdateEndpointRedirectUrl,
  UpdateEndpointStatus,
  UpdateEndpointTargetEmails
} from '@/useCases/endpoints';
import {LoadTeamMember} from '@/useCases/teams';
import {
  deleteEndpointRoute,
  getAllEndpointsRoute,
  getEndpointRoute,
  patchEndpointRoute,
  postEndpointRoute
} from './routes';

export const endpoints = new OpenAPIHono({
  defaultHook: (result, context) => {
    if (!result.success) {
      const error = handleValidationErrors(result.error);
      return context.json(error, 400);
    }
  }
});

endpoints.use(getAllEndpointsRoute.getRoutingPath(), authentication);
endpoints.openapi(getAllEndpointsRoute, async context => {
  const {user} = context.env?.session as {user: string};
  const {teamId} = context.req.valid('param');

  const teamService = new LoadTeamMember(teamId, user);
  const teamResponse = await teamService.run();

  if (teamResponse.status === 401 || teamResponse.status === 404) {
    return context.json(teamResponse.error, teamResponse.status);
  }

  const service = new LoadAllEndpoints(teamId);
  const endpointsData = await service.run();

  if (endpointsData.status === 401 || endpointsData.status === 404) {
    return context.json(endpointsData.error, endpointsData.status);
  }

  const response = endpointsData.body.map(endpoint => {
    return endpointResponse(endpoint);
  });

  return context.json(response, 200);
});

endpoints.use(getEndpointRoute.getRoutingPath(), authentication);
endpoints.openapi(getEndpointRoute, async context => {
  const {user} = context.env?.session as {user: string};
  const {teamId, endpointId} = context.req.valid('param');

  const teamService = new LoadTeamMember(teamId, user);
  const teamResponse = await teamService.run();

  if (teamResponse.status === 401 || teamResponse.status === 404) {
    return context.json(teamResponse.error, teamResponse.status);
  }

  const service = new LoadEndpoint(endpointId);
  const endpointData = await service.run();

  if (endpointData.status === 401 || endpointData.status === 404) {
    return context.json(endpointData.error, endpointData.status);
  }

  const response = endpointResponse(endpointData.body);
  return context.json(response, 200);
});

endpoints.use(postEndpointRoute.getRoutingPath(), authentication);
endpoints.openapi(postEndpointRoute, async context => {
  const {user} = context.env?.session as {user: string};
  const {name, targetEmails} = context.req.valid('json');
  const {teamId} = context.req.valid('param');

  const teamService = new LoadTeamMember(teamId, user);
  const teamResponse = await teamService.run();

  if (teamResponse.status === 401 || teamResponse.status === 404) {
    return context.json(teamResponse.error, teamResponse.status);
  }

  const service = new SaveEndpoint(name, teamId, targetEmails);
  const endpointData = await service.run();

  if (endpointData.status === 401 || endpointData.status === 404) {
    return context.json(endpointData.error, endpointData.status);
  }

  const response = endpointResponse(endpointData.body);
  return context.json(response, 201);
});

endpoints.use(patchEndpointRoute.getRoutingPath(), authentication);
endpoints.openapi(patchEndpointRoute, async context => {
  const {user} = context.env?.session as {user: string};
  const {teamId, endpointId} = context.req.valid('param');
  const request = context.req.valid('json');
  let data: Endpoint | null = null;

  const teamService = new LoadTeamMember(teamId, user);
  const teamResponse = await teamService.run();

  if (teamResponse.status === 401 || teamResponse.status === 404) {
    return context.json(teamResponse.error, teamResponse.status);
  }

  if (request.name !== undefined) {
    const service = new UpdateEndpointName(endpointId, request.name);
    const response = await service.run();

    const error = response.status === 401 || response.status === 404;
    if (error) {
      return context.json(response.error, response.status);
    }

    data = response.body;
  }

  if (request.isEnabled !== undefined) {
    const service = new UpdateEndpointStatus(endpointId, request.isEnabled);
    const response = await service.run();

    const error = response.status === 401 || response.status === 404;
    if (error) {
      return context.json(response.error, response.status);
    }

    data = response.body;
  }

  if (request.emailNotifications !== undefined) {
    const service = new UpdateEndpointEmailNotifications(
      endpointId,
      request.emailNotifications
    );
    const response = await service.run();

    const error = response.status === 401 || response.status === 404;
    if (error) {
      return context.json(response.error, response.status);
    }

    data = response.body;
  }

  if (request.targetEmails !== undefined) {
    const service = new UpdateEndpointTargetEmails(
      endpointId,
      request.targetEmails
    );
    const response = await service.run();

    const error = response.status === 401 || response.status === 404;
    if (error) {
      return context.json(response.error, response.status);
    }

    data = response.body;
  }

  if (request.redirectUrl !== undefined) {
    const service = new UpdateEndpointRedirectUrl(
      endpointId,
      request.redirectUrl
    );
    const response = await service.run();

    const error = response.status === 401 || response.status === 404;
    if (error) {
      return context.json(response.error, response.status);
    }

    data = response.body;
  }

  const hasEmptyValues =
    request.name === undefined &&
    request.isEnabled === undefined &&
    request.redirectUrl === undefined &&
    request.targetEmails === undefined &&
    request.emailNotifications === undefined;

  if (hasEmptyValues || data === null) {
    return context.json(
      {
        name: 'Bad Request',
        description:
          "At least provide one of the following fields: 'name', 'isEnabled', 'emailNotifications', 'redirectUrl', 'targetEmails'"
      },
      400
    );
  }

  return context.json(endpointResponse(data), 200);
});

endpoints.use(deleteEndpointRoute.getRoutingPath(), authentication);
endpoints.openapi(deleteEndpointRoute, async context => {
  const {user} = context.env?.session as {user: string};
  const {teamId, endpointId} = context.req.valid('param');

  const teamService = new LoadTeamMember(teamId, user);
  const teamResponse = await teamService.run();

  if (teamResponse.status === 401 || teamResponse.status === 404) {
    return context.json(teamResponse.error, teamResponse.status);
  }

  const service = new DeleteEndpoint(endpointId);
  const response = await service.run();

  if (response.status === 401 || response.status === 404) {
    return context.json(response.error, response.status);
  }

  return context.json('The endpoint has been deleted.', 204);
});
