import {OpenAPIHono} from '@hono/zod-openapi';
import type {Submission} from 'domain/models';
import {handleValidationErrors} from '@/lib/openapi';
import {createUUID, submissionResponse} from '@/lib/models';
import {authentication, getAuthentication} from '@/lib/auth';
import {LoadEndpoint} from '@/useCases/endpoints';
import {LoadTeam, LoadTeamMember} from '@/useCases/teams';
import {
  DeleteSubmission,
  LoadAllSubmissions,
  LoadSubmission,
  SaveSubmission,
  UpdateSubmissionIsRead,
  UpdateSubmissionIsSpam
} from '@/useCases/submissions';
import {
  deleteSubmissionRoute,
  getAllSubmissionsRoute,
  getSubmissionRoute,
  patchSubmissionRoute,
  postSubmissionRoute
} from './routes';

export const submissions = new OpenAPIHono({
  defaultHook: (result, context) => {
    if (!result.success) {
      const error = handleValidationErrors(result.error);
      return context.json(error, 400);
    }
  }
});

submissions.use(authentication({excludedMethods: ['POST']}));

submissions.openapi(getAllSubmissionsRoute, async context => {
  const {userId, scope, teamId} = getAuthentication(context);
  const {endpointId} = context.req.valid('param');
  const endpointUUID = createUUID(endpointId);

  const endpointService = new LoadEndpoint(endpointUUID);
  const endpointResponse = await endpointService.run();
  const endpoint = endpointResponse.body;

  if (endpointResponse.status === 401 || endpointResponse.status === 404) {
    return context.json(endpointResponse.error, endpointResponse.status);
  }

  const teamService = new LoadTeam(endpoint.team);
  const teamData = await teamService.run();

  if (teamData.status === 401 || teamData.status === 404) {
    return context.json(teamData.error, teamData.status);
  }

  if (scope === 'team' && teamData.body.id !== teamId) {
    return context.json(
      {
        name: 'Unauthorized',
        description:
          'Your API Key scope does not allow you to do this action, create a new one with scope for this team or use one with full access instead.'
      },
      401
    );
  }

  const membersService = new LoadTeamMember(endpoint.team, userId);
  const memberResponse = await membersService.run();

  if (memberResponse.status === 401 || memberResponse.status === 404) {
    return context.json(memberResponse.error, memberResponse.status);
  }

  const service = new LoadAllSubmissions(endpointUUID);
  const submissionsResponse = await service.run();

  if (
    submissionsResponse.status === 401 ||
    submissionsResponse.status === 404
  ) {
    return context.json(submissionsResponse.error, submissionsResponse.status);
  }

  const response = submissionsResponse.body.map(submission => {
    return submissionResponse(submission);
  });

  return context.json(response, 200);
});

submissions.openapi(getSubmissionRoute, async context => {
  const {userId, scope, teamId} = getAuthentication(context);
  const {endpointId, submissionId} = context.req.valid('param');
  const submissionUUID = createUUID(submissionId);
  const endpointUUID = createUUID(endpointId);

  const endpointService = new LoadEndpoint(endpointUUID);
  const endpointResponse = await endpointService.run();
  const endpoint = endpointResponse.body;

  if (endpointResponse.status === 401 || endpointResponse.status === 404) {
    return context.json(endpointResponse.error, endpointResponse.status);
  }

  const teamService = new LoadTeam(endpoint.team);
  const teamData = await teamService.run();

  if (teamData.status === 401 || teamData.status === 404) {
    return context.json(teamData.error, teamData.status);
  }

  if (scope === 'team' && teamData.body.id !== teamId) {
    return context.json(
      {
        name: 'Unauthorized',
        description:
          'Your API Key scope does not allow you to do this action, create a new one with scope for this team or use one with full access instead.'
      },
      401
    );
  }

  const membersService = new LoadTeamMember(endpoint.team, userId);
  const memberResponse = await membersService.run();

  if (memberResponse.status === 401 || memberResponse.status === 404) {
    return context.json(memberResponse.error, memberResponse.status);
  }

  const service = new LoadSubmission(endpointUUID, submissionUUID);
  const response = await service.run();

  if (response.status === 401 || response.status === 404) {
    return context.json(response.error, response.status);
  }

  return context.json(submissionResponse(response.body), 200);
});

submissions.openapi(postSubmissionRoute, async context => {
  const contentType = context.req.header('Content-Type');

  const {endpointId} = context.req.valid('param');
  const endpointUUID = createUUID(endpointId);

  const endpointService = new LoadEndpoint(endpointUUID);
  const endpoint = await endpointService.run();

  const isForm = contentType?.includes('application/x-www-form-urlencoded');
  const isJson = contentType?.includes('application/json');
  // const isMultipartForm = contentType?.includes('multipart/form-data');

  if (isForm) {
    try {
      const form = await context.req.formData();
      const submission = Object.fromEntries(form);

      const service = new SaveSubmission(endpoint.body.id, submission);
      const response = await service.run();

      if (response.status === 404) {
        return context.json(response.error, response.status);
      }

      return context.json(submissionResponse(response.body), 201);
    } catch (error) {
      return context.json(
        {name: 'Bad request', description: 'Malformed Form request.'},
        400
      );
    }
  }

  if (isJson) {
    try {
      const submission = await context.req.json<object>();
      const service = new SaveSubmission(endpoint.body.id, submission);

      const response = await service.run();

      if (response.status === 404) {
        return context.json(response.error, response.status);
      }

      return context.json(submissionResponse(response.body), 201);
    } catch (error) {
      return context.json(
        {name: 'Bad request', description: 'Malformed JSON request.'},
        400
      );
    }
  }

  /*
  if (isMultipartForm) {
    const formData = await context.req.formData();
    const form = await handleFormFiles('formizee', endpoint.body.id, formData);
    const submission = Object.fromEntries(form);

    const service = new SaveSubmission(endpoint.body.id, submission);
    const response = await service.run();

    if (!response.ok) {
      return context.json(response.body, response.status as StatusCode);
    }

    return context.redirect(endpoint.body.redirectUrl);
  }
  */

  return context.json(
    {
      name: 'Bad request',
      description: 'Use one of the supported body types.'
    },
    400
  );
});

submissions.openapi(patchSubmissionRoute, async context => {
  const {userId, scope, teamId} = getAuthentication(context);
  const {endpointId, submissionId} = context.req.valid('param');
  const submissionUUID = createUUID(submissionId);
  const endpointUUID = createUUID(endpointId);
  const request = context.req.valid('json');
  let data: Submission | null = null;

  const endpointService = new LoadEndpoint(endpointUUID);
  const endpointResponse = await endpointService.run();
  const endpoint = endpointResponse.body;

  if (endpointResponse.status === 401 || endpointResponse.status === 404) {
    return context.json(endpointResponse.error, endpointResponse.status);
  }

  const teamService = new LoadTeam(endpoint.team);
  const teamData = await teamService.run();

  if (teamData.status === 401 || teamData.status === 404) {
    return context.json(teamData.error, teamData.status);
  }

  if (scope === 'team' && teamData.body.id !== teamId) {
    return context.json(
      {
        name: 'Unauthorized',
        description:
          'Your API Key scope does not allow you to do this action, create a new one with scope for this team or use one with full access instead.'
      },
      401
    );
  }

  const membersService = new LoadTeamMember(endpoint.team, userId);
  const memberResponse = await membersService.run();

  if (memberResponse.status === 401 || memberResponse.status === 404) {
    return context.json(memberResponse.error, memberResponse.status);
  }

  if (request.isSpam !== undefined) {
    const service = new UpdateSubmissionIsSpam(
      endpointUUID,
      submissionUUID,
      request.isSpam
    );
    const response = await service.run();

    const error = response.status === 401 || response.status === 404;
    if (error) {
      return context.json(response.error, response.status);
    }

    data = response.body;
  }

  if (request.isRead !== undefined) {
    const service = new UpdateSubmissionIsRead(
      endpointUUID,
      submissionUUID,
      request.isRead
    );
    const response = await service.run();

    const error = response.status === 401 || response.status === 404;
    if (error) {
      return context.json(response.error, response.status);
    }

    data = response.body;
  }

  const hasEmptyValues =
    request.isSpam === undefined && request.isRead === undefined;

  if (hasEmptyValues || data === null) {
    return context.json(
      {
        name: 'Bad Request',
        description:
          "At least provide one of the following fields: 'isSpam', 'isRead'"
      },
      400
    );
  }

  return context.json(submissionResponse(data), 200);
});

submissions.openapi(deleteSubmissionRoute, async context => {
  const {endpointId, submissionId} = context.req.valid('param');
  const {userId, scope, teamId} = getAuthentication(context);

  const submissionUUID = createUUID(submissionId);
  const endpointUUID = createUUID(endpointId);

  const endpointService = new LoadEndpoint(endpointUUID);
  const endpointResponse = await endpointService.run();
  const endpoint = endpointResponse.body;

  if (endpointResponse.status === 401 || endpointResponse.status === 404) {
    return context.json(endpointResponse.error, endpointResponse.status);
  }

  const teamService = new LoadTeam(endpoint.team);
  const teamData = await teamService.run();

  if (teamData.status === 401 || teamData.status === 404) {
    return context.json(teamData.error, teamData.status);
  }

  if (scope === 'team' && teamData.body.id !== teamId) {
    return context.json(
      {
        name: 'Unauthorized',
        description:
          'Your API Key scope does not allow you to do this action, create a new one with scope for this team or use one with full access instead.'
      },
      401
    );
  }

  const membersService = new LoadTeamMember(endpoint.team, userId);
  const memberResponse = await membersService.run();

  if (memberResponse.status === 401 || memberResponse.status === 404) {
    return context.json(memberResponse.error, memberResponse.status);
  }

  const service = new DeleteSubmission(endpointUUID, submissionUUID);
  const response = await service.run();

  if (response.status === 401 || response.status === 404) {
    return context.json(response.error, response.status);
  }

  return context.json('The submission has been deleted.', 200);
});
