import {LoadEndpoint} from '@/useCases/endpoints';
import {StatusCode} from 'hono/utils/http-status';
import {Hono} from 'hono';

import {verifySession} from '@/lib/auth';
import {
  DeleteSubmission,
  LoadSubmission,
  LoadSubmissionByForm,
  SaveSubmission
} from '@/useCases/submissions';

export const router = new Hono();

router.get('/:uid', async context => {
  const {isAuth, user} = await verifySession(context);
  if (!isAuth || !user)
    return context.json(
      {error: 'Please, login first in order to do this action'},
      401
    );

  // 1. Get the submission data
  const submission = context.req.param('uid');

  const service = new LoadSubmission(submission);
  const response = await service.run();

  if(!response.ok) return context.json(response.body, response.status as StatusCode)

  // 2. Check if the user is the owner of the form
  const endpointsService = new LoadEndpoint(response.body.endpoint);
  const endpointResponse = await endpointsService.run();

  if (!endpointResponse.ok)
    return context.json(
      endpointResponse.error,
      endpointResponse.status as StatusCode
    );

  if (endpointResponse.body.owner !== user)
    return context.json(
      {error: 'You do not have permission to access this data'},
      401
    );

  return context.json(response.body, response.status as StatusCode);
});

router.get('/:form', async context => {
  const {isAuth, user} = await verifySession(context);
  if (!isAuth || !user)
    return context.json(
      {error: 'Please, login first in order to do this action'},
      401
    );

  const endpoint = context.req.param('form');

  // 1. Validate the request with zod

  // 2. Check if the user is the owner of the form
  const endpointsService = new LoadEndpoint(endpoint);
  const endpointResponse = await endpointsService.run();

  if (!endpointResponse.ok)
    return context.json(
      endpointResponse.error,
      endpointResponse.status as StatusCode
    );

  if (endpointResponse.body.owner !== user)
    return context.json(
      {error: 'You do not have permission to access this data'},
      401
    );

  // 3. Get the submissions of the form
  const submissionsService = new LoadSubmissionByForm(endpoint);
  const response = await submissionsService.run();

  return context.json(response.body, response.status as StatusCode);
});

router.post('/:form', async context => {
  const {isAuth, user} = await verifySession(context);
  if (!isAuth || !user)
    return context.json(
      {error: 'Please, login first in order to do this action'},
      401
    );

  const endpoint = context.req.param('form');
  const data = await context.req.formData();

  // 1. Validate the request with zod

  // 2. Check if the user is the owner of the form
  const endpointsService = new LoadEndpoint(endpoint);
  const endpointResponse = await endpointsService.run();

  if (!endpointResponse.ok)
    return context.json(
      endpointResponse.error,
      endpointResponse.status as StatusCode
    );

  if (endpointResponse.body.owner !== user)
    return context.json(
      {error: 'You do not have permission to access this data'},
      401
    );

  // 3. Post the submission to the endpoint
  const submissionsService = new SaveSubmission(endpoint, data);
  const response = await submissionsService.run();

  return context.json(response.body, response.status as StatusCode);
});

router.delete('/:uid', async context => {
  const {isAuth, user} = await verifySession(context);
  if (!isAuth || !user)
    return context.json(
      {error: 'Please, login first in order to do this action'},
      401
    );

  const submission = context.req.param('uid');

  // 1. Validate the request with zod

  // 2. Check if the user is the owner of the form
  const submissionsService = new LoadSubmission(submission);
  const submissionsResponse = await submissionsService.run();

  if (!submissionsResponse.ok)
    return context.json(
      submissionsResponse.error,
      submissionsResponse.status as StatusCode
    );

  const endpointsService = new LoadEndpoint(submissionsResponse.body.endpoint);
  const endpointResponse = await endpointsService.run();

  if (!endpointResponse.ok)
    return context.json(
      endpointResponse.error,
      endpointResponse.status as StatusCode
    );

  if (endpointResponse.body.owner !== user)
    return context.json(
      {error: 'You do not have permission to access this data'},
      401
    );

  // 3. Post the submission to the endpoint
  const service = new DeleteSubmission(submission);
  const response = await service.run();

  return context.json(response.body, response.status as StatusCode);
});

export default router;
