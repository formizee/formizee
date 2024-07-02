import {OpenAPIHono} from '@hono/zod-openapi';
import type {Submission} from 'domain/models';
import {handleValidationErrors} from '@/lib/openapi';
import {submissionResponse} from '@/lib/models';
import {authentication} from '@/lib/auth';
import {LoadEndpoint} from '@/useCases/endpoints';
import {LoadTeamMember} from '@/useCases/teams';
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

submissions.use(getAllSubmissionsRoute.getRoutingPath(), authentication);
submissions.openapi(getAllSubmissionsRoute, async context => {
  const {user} = context.env?.session as {user: string};
  const {endpointId} = context.req.valid('param');

  const endpointService = new LoadEndpoint(endpointId);
  const endpointResponse = await endpointService.run();
  const endpoint = endpointResponse.body;

  if (endpointResponse.status === 401 || endpointResponse.status === 404) {
    return context.json(endpointResponse.error, endpointResponse.status);
  }

  const teamService = new LoadTeamMember(endpoint.id, user);
  const teamResponse = await teamService.run();

  if (teamResponse.status === 401 || teamResponse.status === 404) {
    return context.json(teamResponse.error, teamResponse.status);
  }

  const service = new LoadAllSubmissions(endpointId);
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

submissions.use(getSubmissionRoute.getRoutingPath(), authentication);
submissions.openapi(getSubmissionRoute, async context => {
  const {endpointId, submissionId} = context.req.valid('param');
  const {user} = context.env?.session as {user: string};

  const endpointService = new LoadEndpoint(endpointId);
  const endpointResponse = await endpointService.run();
  const endpoint = endpointResponse.body;

  if (endpointResponse.status === 401 || endpointResponse.status === 404) {
    return context.json(endpointResponse.error, endpointResponse.status);
  }

  const teamService = new LoadTeamMember(endpoint.id, user);
  const teamResponse = await teamService.run();

  if (teamResponse.status === 401 || teamResponse.status === 404) {
    return context.json(teamResponse.error, teamResponse.status);
  }

  const service = new LoadSubmission(endpointId, submissionId);
  const response = await service.run();

  if (response.status === 401 || response.status === 404) {
    return context.json(response.error, response.status);
  }

  return context.json(submissionResponse(response.body), 200);
});

submissions.openapi(postSubmissionRoute, async context => {
  const contentType = context.req.header('Content-Type');
  const {endpointId} = context.req.valid('param');

  const endpointService = new LoadEndpoint(endpointId);
  const endpoint = await endpointService.run();

  const isForm = contentType?.includes('application/x-www-form-urlencoded');
  const isJson = contentType?.includes('application/json');
  // const isMultipartForm = contentType?.includes('multipart/form-data');

  if (isForm) {
    const form = await context.req.formData();
    const submission = Object.fromEntries(form);

    const service = new SaveSubmission(endpoint.body.id, submission);
    const response = await service.run();

    if (response.status === 404) {
      return context.json(response.error, response.status);
    }

    return context.json(submissionResponse(response.body), 201);
  }

  if (isJson) {
    const submission = await context.req.json<object>();
    const service = new SaveSubmission(endpoint.body.id, submission);

    const response = await service.run();

    if (response.status === 404) {
      return context.json(response.error, response.status);
    }

    return context.json(submissionResponse(response.body), 201);
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

submissions.use(patchSubmissionRoute.getRoutingPath(), authentication);
submissions.openapi(patchSubmissionRoute, async context => {
  const {endpointId, submissionId} = context.req.valid('param');
  const request = context.req.valid('json');
  let data: Submission | null = null;

  if (request.isSpam !== undefined) {
    const service = new UpdateSubmissionIsSpam(
      endpointId,
      submissionId,
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
      endpointId,
      submissionId,
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

submissions.use(deleteSubmissionRoute.getRoutingPath(), authentication);
submissions.openapi(deleteSubmissionRoute, async context => {
  const {endpointId, submissionId} = context.req.valid('param');
  const {user} = context.env?.session as {user: string};

  const endpointService = new LoadEndpoint(endpointId);
  const endpointResponse = await endpointService.run();
  const endpoint = endpointResponse.body;

  if (endpointResponse.status === 401 || endpointResponse.status === 404) {
    return context.json(endpointResponse.error, endpointResponse.status);
  }

  const teamService = new LoadTeamMember(endpoint.id, user);
  const teamResponse = await teamService.run();

  if (teamResponse.status === 401 || teamResponse.status === 404) {
    return context.json(teamResponse.error, teamResponse.status);
  }

  const service = new DeleteSubmission(endpointId, submissionId);
  const response = await service.run();

  if (response.status === 401 || response.status === 404) {
    return context.json(response.error, response.status);
  }

  return context.json('The submission has been deleted.', 204);
});
