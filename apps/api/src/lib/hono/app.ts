import {handleError, handleNotFound, handleZodError} from '@/lib/errors';
import {OpenAPIHono} from '@hono/zod-openapi';
import {services} from '@/lib/services';
import type {HonoEnv} from './types';
import {
  cors,
  timeout,
  bodyLimit,
  prettyJSON,
  secureHeaders,
  trimTrailingSlash,
  metrics
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

  app.use('*', services());

  // Middlewares
  app.use(trimTrailingSlash());
  app.use(secureHeaders());
  //app.use(rateLimiter());
  app.use(prettyJSON());
  app.use(bodyLimit);
  app.use(metrics());
  app.use(timeout);
  app.use(cors());

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
        url: 'https://api.formizee.com',
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
        bearerAuth: []
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
