import {handleError, handleZodError} from '@/lib/errors';
import {apiReference} from '@scalar/hono-api-reference';
import {OpenAPIHono} from '@hono/zod-openapi';
import type {HonoVariables} from './types';
import {env} from '@/lib/enviroment';
import {
  cors,
  logger,
  timeout,
  bodyLimit,
  prettyJSON,
  rateLimiter,
  secureHeaders,
  trimTrailingSlash
} from '@/lib/middlewares';

export const newRoute = (
  basePath = '/'
): OpenAPIHono<{Variables: HonoVariables}> => {
  return new OpenAPIHono<{Variables: HonoVariables}>({
    defaultHook: handleZodError
  }).basePath(basePath);
};

export const newApp = (): OpenAPIHono<{Variables: HonoVariables}> => {
  const app = new OpenAPIHono<{Variables: HonoVariables}>();
  app.onError(handleError);

  // Middlewares
  app.use(trimTrailingSlash());
  app.use(secureHeaders());
  app.use(rateLimiter());
  app.use(prettyJSON());
  app.use(bodyLimit);
  app.use(timeout);
  app.use(logger);
  app.use(cors);

  // Openapi
  app.doc('/openapi.json', {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Formizee API',
      description: 'The Forms Backend Platform API',
      termsOfService: 'https://www.formizee.com/legal/terms-of-service',
      license: {
        name: 'Apache 2.0',
        url: 'https://github.com/formizee/formizee/blob/main/LICENSE'
      },
      contact: {
        email: 'support@formizee.com'
      }
    },
    servers: [
      {
        url: env.API_URL,
        description: 'Stable Release'
      }
    ],
    tags: [
      {name: 'Health'},
      {name: 'Keys'},
      {name: 'Endpoints'},
      {name: 'Submissions'}
    ],
    security: [
      {
        apiKey: []
      }
    ]
  });

  app.openAPIRegistry.registerComponent('securitySchemes', 'apiKey', {
    name: 'X-Formizee-Api-Key',
    type: 'apiKey',
    in: 'header'
  });

  app.get(
    '/docs',
    apiReference({
      pageTitle: 'Formizee API Reference',
      hideModels: true,
      spec: {
        url: '/openapi.json'
      }
    })
  );

  return app;
};

export type App = ReturnType<typeof newApp>;
