import type {StatusCode} from 'hono/utils/http-status';
import {zValidator} from '@hono/zod-validator';
import {Hono} from 'hono';
import {verifySession} from '@/lib/auth';
import {LoadEndpoint} from '@/useCases/endpoints';
import {
  DeleteSubmission,
  LoadAllSubmissions,
  LoadSubmission,
  SaveSubmission,
  UpdateSubmissionIsSpam
} from '@/useCases/submissions';
import {Param, GetAll, Patch, Post} from './schemas';

export const submissions = new Hono();

submissions.get('/:endpoint', zValidator('param', GetAll), async context => {
  const {isAuth, user} = await verifySession(context);
  const {endpoint} = context.req.valid('param');

  if (!isAuth || !user) {
    return context.json(
      {error: 'Please, login first in order to do this action.'},
      401
    );
  }

  const service = new LoadAllSubmissions(endpoint);
  const response = await service.run();

  return context.json(response.body, response.status as StatusCode);
});

submissions.get(
  '/:endpoint/:uid',
  zValidator('param', Param),
  async context => {
    const {isAuth, user} = await verifySession(context);
    const {endpoint, uid} = context.req.valid('param');

    if (!isAuth || !user) {
      return context.json(
        {error: 'Please, login first in order to do this action.'},
        401
      );
    }

    const service = new LoadSubmission(endpoint, uid);
    const response = await service.run();

    return context.json(response.body, response.status as StatusCode);
  }
);

submissions.post('/:endpoint', zValidator('param', Post), async context => {
  const contentType = context.req.header('Content-Type');
  const param = context.req.valid('param');

  const endpointService = new LoadEndpoint(param.endpoint);
  const endpoint = await endpointService.run();

  if (!endpoint.ok) {
    return context.redirect('https://formizee.com/submissions/404');
  }

  const isForm = contentType?.includes('application/x-www-form-urlencoded');
  //const isMultipartForm = contentType?.includes('multipart/form-data');
  const isJson = contentType?.includes('application/json');

  if (isForm) {
    const form = await context.req.formData();
    const submission = Object.fromEntries(form);

    const service = new SaveSubmission(endpoint.body.id, submission);
    const response = await service.run();

    if (!response.ok) {
      return context.json(response.body, response.status as StatusCode);
    }

    return context.redirect(endpoint.body.redirectUrl);
  }

  if (isJson) {
    const submission = await context.req.json<object>();
    const service = new SaveSubmission(endpoint.body.id, submission);

    const response = await service.run();
    return context.json(response.body, response.status as StatusCode);
  }

  return context.redirect('https://formizee.com/submissions/404');
  /*
  if (isMultipartForm) {
    const formData = await context.req.formData();
    const form = await handleFormFiles('formizee', endpoint.body.uid, formData);
    const submission = Object.fromEntries(form);

    const service = new SaveSubmission(endpoint.body.uid, submission);
    const response = await service.run();

    if (!response.ok) {
      return context.json(response.body, response.status as StatusCode);
    }

    return context.redirect(endpoint.body.redirectUrl);
  }
  */
});

submissions.patch(
  '/:endpoint/:uid',
  zValidator('param', Param),
  zValidator('json', Patch),
  async context => {
    const {isAuth, user} = await verifySession(context);
    const {endpoint, uid} = context.req.valid('param');
    const {isSpam} = context.req.valid('json');

    if (!isAuth || !user) {
      return context.json(
        {error: 'Please, login first in order to do this action.'},
        401
      );
    }

    const service = new UpdateSubmissionIsSpam(endpoint, uid, isSpam);
    const response = await service.run();

    return context.json(response.body, response.status as StatusCode);
  }
);

//eslint-disable-next-line -- Drizzle eslint plugin mistake
submissions.delete(
  '/:endpoint/:uid',
  zValidator('param', Param),
  async context => {
    const {isAuth, user} = await verifySession(context);
    const {endpoint, uid} = context.req.valid('param');

    if (!isAuth || !user) {
      return context.json(
        {error: 'Please, login first in order to do this action.'},
        401
      );
    }

    const service = new DeleteSubmission(endpoint, uid);
    const response = await service.run();

    return context.json(response.body, response.status as StatusCode);
  }
);

export default submissions;
