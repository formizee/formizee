import {OpenAPIHono} from '@hono/zod-openapi';
import type {Endpoint} from 'domain/models';
import {handleValidationErrors} from '@/lib/openapi';
import {createUUID, endpointResponse} from '@/lib/models';
import {authentication, getAuthentication} from '@/lib/auth';
import {
  DeleteEndpoint,
  LoadAllEndpoints,
  LoadEndpoint,
  SaveEndpoint,
  UpdateEndpointColor,
  UpdateEndpointEmailNotifications,
  UpdateEndpointIcon,
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

endpoints.use(authentication());

endpoints.openapi(getAllEndpointsRoute, async context => {
  const {userId} = getAuthentication(context);
  const {team} = context.req.valid('param');

  const teamService = new LoadTeamMember(team, userId);
  const teamResponse = await teamService.run();

  if (teamResponse.status === 401 || teamResponse.status === 404) {
    return context.json(teamResponse.error, teamResponse.status);
  }

  const service = new LoadAllEndpoints(team);
  const endpointsData = await service.run();

  if (endpointsData.status === 401 || endpointsData.status === 404) {
    return context.json(endpointsData.error, endpointsData.status);
  }

  const response = endpointsData.body.map(endpoint => {
    return endpointResponse(endpoint);
  });

  return context.json(response, 200);
});

endpoints.openapi(getEndpointRoute, async context => {
  const {userId} = getAuthentication(context);
  const {team, endpointId} = context.req.valid('param');
  const endpointUUID = createUUID(endpointId);

  const teamService = new LoadTeamMember(team, userId);
  const teamResponse = await teamService.run();

  if (teamResponse.status === 401 || teamResponse.status === 404) {
    return context.json(teamResponse.error, teamResponse.status);
  }

  const service = new LoadEndpoint(endpointUUID);
  const endpointData = await service.run();

  if (endpointData.status === 401 || endpointData.status === 404) {
    return context.json(endpointData.error, endpointData.status);
  }

  const response = endpointResponse(endpointData.body);
  return context.json(response, 200);
});

endpoints.openapi(postEndpointRoute, async context => {
  const {userId} = getAuthentication(context);
  const {name, targetEmails, color, icon} = context.req.valid('json');
  const {team} = context.req.valid('param');

  const teamService = new LoadTeamMember(team, userId);
  const teamResponse = await teamService.run();

  if (teamResponse.status === 401 || teamResponse.status === 404) {
    return context.json(teamResponse.error, teamResponse.status);
  }

  const member = teamResponse.body;
  const permissions =
    member.permissions === 'create' || member.permissions === 'all';
  if (!permissions) {
    return context.json(
      {
        name: 'Unauthorized',
        description: "You don't have permissions to create new endpoints."
      },
      401
    );
  }

  const service = new SaveEndpoint(name, team, targetEmails, color, icon);
  const endpointData = await service.run();

  if (endpointData.status === 401 || endpointData.status === 404) {
    return context.json(endpointData.error, endpointData.status);
  }

  const response = endpointResponse(endpointData.body);
  return context.json(response, 201);
});

endpoints.openapi(patchEndpointRoute, async context => {
  const {userId} = getAuthentication(context);
  const {team, endpointId} = context.req.valid('param');
  const endpointUUID = createUUID(endpointId);
  const request = context.req.valid('json');
  let data: Endpoint | null = null;

  const teamService = new LoadTeamMember(team, userId);
  const teamResponse = await teamService.run();

  if (teamResponse.status === 401 || teamResponse.status === 404) {
    return context.json(teamResponse.error, teamResponse.status);
  }

  const member = teamResponse.body;
  const permissions = member.permissions !== 'read';
  if (!permissions) {
    return context.json(
      {
        name: 'Unauthorized',
        description: "You don't have permissions to edit endpoints."
      },
      401
    );
  }

  if (request.name !== undefined) {
    const service = new UpdateEndpointName(endpointUUID, request.name);
    const response = await service.run();

    const error = response.status === 401 || response.status === 404;
    if (error) {
      return context.json(response.error, response.status);
    }

    data = response.body;
  }

  if (request.isEnabled !== undefined) {
    const service = new UpdateEndpointStatus(endpointUUID, request.isEnabled);
    const response = await service.run();

    const error = response.status === 401 || response.status === 404;
    if (error) {
      return context.json(response.error, response.status);
    }

    data = response.body;
  }

  if (request.emailNotifications !== undefined) {
    const service = new UpdateEndpointEmailNotifications(
      endpointUUID,
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
      endpointUUID,
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
      endpointUUID,
      request.redirectUrl
    );
    const response = await service.run();

    const error = response.status === 401 || response.status === 404;
    if (error) {
      return context.json(response.error, response.status);
    }

    data = response.body;
  }

  if (request.color !== undefined) {
    const service = new UpdateEndpointColor(endpointUUID, request.color);
    const response = await service.run();

    const error = response.status === 401 || response.status === 404;
    if (error) {
      return context.json(response.error, response.status);
    }

    data = response.body;
  }

  if (request.icon !== undefined) {
    const service = new UpdateEndpointIcon(endpointUUID, request.icon);
    const response = await service.run();

    const error = response.status === 401 || response.status === 404;
    if (error) {
      return context.json(response.error, response.status);
    }

    data = response.body;
  }

  const hasEmptyValues =
    request.name === undefined &&
    request.icon === undefined &&
    request.color === undefined &&
    request.isEnabled === undefined &&
    request.redirectUrl === undefined &&
    request.targetEmails === undefined &&
    request.emailNotifications === undefined;

  if (hasEmptyValues || data === null) {
    return context.json(
      {
        name: 'Bad Request',
        description: `At least provide one of the following fields:
        'name', 'icon', 'color', 'isEnabled', 'redirectUrl',
        'targetEmails', 'emailNotifications'.`
      },
      400
    );
  }

  return context.json(endpointResponse(data), 200);
});

endpoints.openapi(deleteEndpointRoute, async context => {
  const {userId} = getAuthentication(context);
  const {team, endpointId} = context.req.valid('param');
  const endpointUUID = createUUID(endpointId);

  const teamService = new LoadTeamMember(team, userId);
  const teamResponse = await teamService.run();

  if (teamResponse.status === 401 || teamResponse.status === 404) {
    return context.json(teamResponse.error, teamResponse.status);
  }

  const member = teamResponse.body;
  const permissions = member.permissions === 'all';
  if (!permissions) {
    return context.json(
      {
        name: 'Unauthorized',
        description: "You don't have permissions to delete endpoints."
      },
      401
    );
  }

  const service = new DeleteEndpoint(endpointUUID);
  const response = await service.run();

  if (response.status === 401 || response.status === 404) {
    return context.json(response.error, response.status);
  }

  return context.json('The endpoint has been deleted.', 200);
});
