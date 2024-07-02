import {createRoute, z} from '@hono/zod-openapi';
import {EndpointSchema, ErrorSchema} from '@/schemas';
import {
  DeleteEndpointSchema,
  GetAllEndpointsSchema,
  GetEndpointSchema,
  PostEndpointParamSchema,
  PostEndpointJsonSchema,
  PatchEndpointParamSchema,
  PatchEndpointJsonSchema
} from './schemas';

export const getAllEndpointsRoute = createRoute({
  method: 'get',
  path: '/{teamId}',
  summary: 'Get all endpoints',
  description: 'Returns all endpoints owned by the given team.',
  operationId: 'loadAllEndpoints',
  tags: ['Endpoints'],
  request: {
    params: GetAllEndpointsSchema
  },
  responses: {
    200: {
      description: 'Endpoints Loaded Successfully',
      content: {
        'application/json': {
          schema: EndpointSchema.array()
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
      description: 'Team not found',
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      }
    }
  }
});

export const getEndpointRoute = createRoute({
  method: 'get',
  path: '/{teamId}/{endpointId}',
  summary: 'Get endpoint',
  description: 'Returns the endpoint specified on the id.',
  operationId: 'loadEndpoint',
  tags: ['Endpoints'],
  request: {
    params: GetEndpointSchema
  },
  responses: {
    200: {
      description: 'Endpoint Loaded Successfully',
      content: {
        'application/json': {
          schema: EndpointSchema
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
      description: 'Endpoint not found',
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      }
    }
  }
});

export const postEndpointRoute = createRoute({
  method: 'post',
  path: '/{teamId}',
  summary: 'Create endpoint',
  description: 'Creates a new endpoint with the given name.',
  operationId: 'saveEndpoint',
  tags: ['Endpoints'],
  security: [],
  request: {
    params: PostEndpointParamSchema,
    body: {
      content: {
        'application/json': {
          schema: PostEndpointJsonSchema
        }
      }
    }
  },
  responses: {
    201: {
      description: 'Endpoint Saved Successfully',
      content: {
        'application/json': {
          schema: EndpointSchema
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
      description: 'Team not found',
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      }
    }
  }
});

export const patchEndpointRoute = createRoute({
  method: 'patch',
  path: '/{teamId}/{endpointId}',
  summary: 'Update endpoint data',
  description: 'Updates the endpoint specified on the id.',
  operationId: 'updateEndpoint',
  tags: ['Endpoints'],
  request: {
    params: PatchEndpointParamSchema,
    body: {
      content: {
        'application/json': {
          schema: PatchEndpointJsonSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Endpoint Updated Successfully',
      content: {
        'application/json': {
          schema: EndpointSchema
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
      description: 'Endpoint not found',
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      }
    }
  }
});

export const deleteEndpointRoute = createRoute({
  method: 'delete',
  path: '/{teamId}/{endpointId}',
  summary: 'Delete endpoint',
  description: 'Deletes the endpoint specified on the id.',
  operationId: 'deleteEndpoint',
  tags: ['Endpoints'],
  request: {
    params: DeleteEndpointSchema
  },
  responses: {
    204: {
      description: 'Endpoint Deleted Successfully',
      content: {
        'text/plain': {
          example: 'The endpoint has been deleted.',
          schema: z.string()
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
      description: 'Endpoint not found',
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      }
    }
  }
});
