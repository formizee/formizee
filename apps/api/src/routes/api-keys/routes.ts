import {createRoute, z} from '@hono/zod-openapi';
import {APIKeySchema, ErrorSchema} from '@/schemas';
import {DeleteAPIKeySchema, PostAPIKeySchema} from './schemas';

export const getAllAPIKeysRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'Get all api keys',
  description: 'Returns all the api keys created by the user.',
  operationId: 'loadAllAPIKeys',
  tags: ['API Keys'],
  responses: {
    200: {
      description: 'API Keys loaded successfully',
      content: {
        'application/json': {
          schema: APIKeySchema.array()
        }
      }
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      }
    },
    401: {
      description: 'Unauthorized access',
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      }
    },
    404: {
      description: 'User not found',
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      }
    }
  }
});

export const postAPIKeyRoute = createRoute({
  method: 'post',
  path: '/',
  summary: 'Create API key',
  description: 'Creates a new API key with the given scope.',
  operationId: 'saveAPIKey',
  tags: ['API Keys'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: PostAPIKeySchema
        }
      }
    }
  },
  responses: {
    201: {
      description: 'API Key saved successfully',
      content: {
        'application/json': {
          schema: z.string(),
          example: 'fz_k5xmPiPqfayi8nNihcyJnR'
        }
      }
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      }
    },
    401: {
      description: 'Unauthorized access',
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      }
    },
    404: {
      description: 'User not found',
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      }
    }
  }
});

export const deleteAPIKeyRoute = createRoute({
  method: 'delete',
  path: '/{apiKeyId}',
  summary: 'Delete API key',
  description: 'Deletes the API key specified on the id.',
  operationId: 'deleteAPIKey',
  tags: ['API Keys'],
  request: {
    params: DeleteAPIKeySchema
  },
  responses: {
    200: {
      description: 'API Key deleted successfully',
      content: {
        'text/plain': {
          schema: z.string(),
          example: 'The API key has been deleted.'
        }
      }
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      }
    },
    401: {
      description: 'Unauthorized access',
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      }
    },
    404: {
      description: 'API key not found',
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      }
    }
  }
});
