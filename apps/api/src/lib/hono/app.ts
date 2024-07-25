import {handleError, handleNotFound, handleZodError} from '@/lib/errors';
import {OpenAPIHono} from '@hono/zod-openapi';
import type {HonoEnv} from './types';
import {env} from '@/lib/enviroment';
import {
  cors,
  logger,
  timeout,
  bodyLimit,
  prettyJSON,
  rateLimiter,
  secureHeaders,
  trimTrailingSlash,
  services
} from '@/lib/middlewares';

export const newRoute = (basePath = '/'): OpenAPIHono<HonoEnv> => {
  const route = new OpenAPIHono<HonoEnv>({
    defaultHook: handleZodError
  }).basePath(basePath);

  route.use('*', services());
  route.notFound(handleNotFound);
  route.onError(handleError);

  return route;
};

export const newApp = (): OpenAPIHono<HonoEnv> => {
  const app = new OpenAPIHono<HonoEnv>();
  app.notFound(handleNotFound);
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

  app.openAPIRegistry.registerComponent('securitySchemes', 'bearerAuth', {
    bearerFormat: 'root key',
    scheme: 'bearer',
    type: 'http'
  });

  return app;
};

export type App = ReturnType<typeof newApp>;
