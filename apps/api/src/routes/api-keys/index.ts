import {OpenAPIHono} from '@hono/zod-openapi';
import {handleValidationErrors} from '@/lib/openapi';
import {apiKeyResponse, createUUID} from '@/lib/models';
import {authentication} from '@/lib/auth';
import {DeleteAPIKey, LoadAllAPIKeys, SaveAPIKey} from '@/useCases/api-keys';
import {deleteAPIKeyRoute, getAllAPIKeysRoute, postAPIKeyRoute} from './routes';

export const apiKeys = new OpenAPIHono({
  defaultHook: (result, context) => {
    if (!result.success) {
      const error = handleValidationErrors(result.error);
      return context.json(error, 400);
    }
  }
});

apiKeys.use(authentication);

apiKeys.openapi(getAllAPIKeysRoute, async context => {
  const {user} = context.env?.session as {user: string};

  const service = new LoadAllAPIKeys(user);
  const data = await service.run();

  const error = data.status === 401 || data.status === 404;
  if (error) {
    return context.json(data.error, data.status);
  }

  const response = data.body.map(key => apiKeyResponse(key));
  return context.json(response, 200);
});

apiKeys.openapi(postAPIKeyRoute, async context => {
  const {user} = context.env?.session as {user: string};
  const {scope, expirationDate, team} = context.req.valid('json');

  if (scope === 'team' && team === undefined) {
    return context.json(
      {
        name: 'Bad request',
        description: 'Specify the team you want to give access to.'
      },
      400
    );
  }

  const service = new SaveAPIKey(user, scope, expirationDate, team);
  const data = await service.run();

  const error = data.status === 401 || data.status === 404;
  if (error) {
    return context.json(data.error, data.status);
  }

  return context.json(data.body, 201);
});

apiKeys.openapi(deleteAPIKeyRoute, async context => {
  const {user} = context.env?.session as {user: string};
  const {apiKeyId} = context.req.valid('param');
  const apiKeyUUID = createUUID(apiKeyId);

  const service = new DeleteAPIKey(apiKeyUUID, user);
  const data = await service.run();

  const error = data.status === 401 || data.status === 404;
  if (error) {
    return context.json(data.error, data.status);
  }

  return context.text('The API key has been deleted.', 200);
});
