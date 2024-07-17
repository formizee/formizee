import type {ErrorSchema} from '@/schemas';
import type {OpenAPIHono} from '@hono/zod-openapi';
import type {ZodError, z} from 'zod';

export const openApi = (router: OpenAPIHono): void => {
  if (!process.env.API_URL) {
    throw new Error('API_URL enviroment variable is not defined.');
  }

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
        url: process.env.API_URL,
        description: 'Stable Release'
      }
    ],
    tags: [
      {name: 'Health'},
      {name: 'Profile'},
      {name: 'API Keys'},
      {name: 'Authentication'},
      {name: 'Teams'},
      {name: 'Endpoints'},
      {name: 'Submissions'},
      {name: 'Waitlist'}
    ],
    security: [
      {
        apiKey: []
      }
    ]
  });

  router.openAPIRegistry.registerComponent('securitySchemes', 'apiKey', {
    name: 'X-Formizee-Api-Key',
    type: 'apiKey',
    in: 'header'
  });
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
