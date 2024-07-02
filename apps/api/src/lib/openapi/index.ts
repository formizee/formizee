import {apiReference} from '@scalar/hono-api-reference';
import type {OpenAPIHono} from '@hono/zod-openapi';
import type {ZodError, z} from 'zod';
import type {ErrorSchema} from '@/schemas';

export const openApi = (router: OpenAPIHono): void => {
  router.doc('/openapi.json', {
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
        url: 'https://api.formizee.com/v1',
        description: 'Stable Release'
      },
      {
        url: 'http://localhost:3001/v1',
        description: 'Development Server'
      }
    ],
    security: [
      {
        session: []
      }
    ]
  });

  router.openAPIRegistry.registerComponent(
    'securitySchemes',
    'formizee api key',
    {
      name: 'X-Formizee-Api-Key',
      type: 'apiKey',
      in: 'header'
    }
  );

  router.get(
    '/docs',
    apiReference({
      pageTitle: 'Formizee API Reference',
      theme: 'deepSpace',
      spec: {
        url: 'openapi.json'
      }
    })
  );
};

type ErrorResponse = z.infer<typeof ErrorSchema>;
export const handleValidationErrors = (
  error: ZodError<unknown>
): ErrorResponse => {
  const validationError = `${error.errors[0]?.path.toString() ?? ''} ${error.errors[0]?.message.toString() ?? ''}`;
  return {
    name: 'Bad request',
    description:
      validationError.trim() !== ''
        ? validationError
        : 'Please review your request and try again.'
  };
};