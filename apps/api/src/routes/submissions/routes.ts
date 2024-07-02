import {createRoute, z} from '@hono/zod-openapi';
import {SubmissionSchema, ErrorSchema} from '@/schemas';
import {
  DeleteSubmissionSchema,
  GetAllSubmissionsSchema,
  GetSubmissionSchema,
  PostSubmissionParamSchema,
  PostSubmissionJsonSchema,
  PatchSubmissionJsonSchema,
  PatchSubmissionParamSchema
} from './schemas';

export const getAllSubmissionsRoute = createRoute({
  method: 'get',
  path: '/{endpointId}',
  summary: 'Get All Submissions',
  description: 'Returns all endpoint owned submissions.',
  operationId: 'loadAllSubmissions',
  tags: ['Submissions'],
  request: {
    params: GetAllSubmissionsSchema
  },
  responses: {
    200: {
      description: 'Submissions Loaded Successfully',
      content: {
        'application/json': {
          schema: SubmissionSchema.array()
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

export const getSubmissionRoute = createRoute({
  method: 'get',
  path: '/{endpointId}/{submissionId}',
  summary: 'Get Submission',
  description: 'Returns the submission specified on the id.',
  operationId: 'loadSubmission',
  tags: ['Submissions'],
  request: {
    params: GetSubmissionSchema
  },
  responses: {
    200: {
      description: 'Submissions Loaded Successfully',
      content: {
        'application/json': {
          schema: SubmissionSchema
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
      description: 'Submission not found',
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      }
    }
  }
});

export const postSubmissionRoute = createRoute({
  method: 'post',
  path: '/{endpointId}',
  summary: 'Create Submission',
  description: 'Creates a new submission with the given data.',
  operationId: 'saveSubmission',
  tags: ['Submissions'],
  security: [],
  request: {
    params: PostSubmissionParamSchema,
    body: {
      content: {
        'application/json': {
          schema: PostSubmissionJsonSchema
        }
      }
    }
  },
  responses: {
    201: {
      description: 'Submission Saved Successfully',
      content: {
        'application/json': {
          schema: SubmissionSchema
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

export const patchSubmissionRoute = createRoute({
  method: 'patch',
  path: '/{endpointId}/{submissionId}',
  summary: 'Update Submission Data',
  description: 'Updates the submission specified on the id.',
  operationId: 'updateSubmission',
  tags: ['Submissions'],
  request: {
    params: PatchSubmissionParamSchema,
    body: {
      content: {
        'application/json': {
          schema: PatchSubmissionJsonSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Submission Updated Successfully',
      content: {
        'application/json': {
          schema: SubmissionSchema
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
      description: 'Submission not found',
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      }
    }
  }
});

export const deleteSubmissionRoute = createRoute({
  method: 'delete',
  path: '/{endpointId}/{submissionId}',
  summary: 'Delete Submission',
  description: 'Deletes the submission specified on the id.',
  operationId: 'deleteSubmission',
  tags: ['Submissions'],
  request: {
    params: DeleteSubmissionSchema
  },
  responses: {
    204: {
      description: 'Submission Deleted Successfully',
      content: {
        'text/plain': {
          example: 'The submission has been deleted.',
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
      description: 'Submission not found',
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      }
    }
  }
});
