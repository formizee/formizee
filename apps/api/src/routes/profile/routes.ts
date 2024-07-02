import {createRoute, z} from '@hono/zod-openapi';
import {ErrorSchema, UserSchema} from '@/schemas';
import {
  DeleteProfileSchema,
  PatchProfileSchema,
  PostLinkedEmailsSchema,
  DeleteLinkedEmailsSchema
} from './schemas';

export const getProfileRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'Get Profile',
  description: 'Returns the user data.',
  operationId: 'loadProfile',
  tags: ['Profile'],
  responses: {
    200: {
      description: 'Profile loaded successfully',
      content: {
        'application/json': {
          schema: UserSchema
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
      description: 'Profile not found',
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      }
    }
  }
});

export const patchProfileRoute = createRoute({
  method: 'patch',
  path: '/',
  summary: 'Update Profile',
  description: 'Updates the user data',
  operationId: 'updateProfile',
  tags: ['Profile'],
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: PatchProfileSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Profile updated successfully',
      content: {
        'application/json': {
          schema: UserSchema
        }
      }
    },
    400: {
      description: 'Bad Request',
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
      description: 'Profile not found',
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      }
    },
    409: {
      description: "Some data can't be updated due to a conflict",
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      }
    }
  }
});

export const deleteProfileRoute = createRoute({
  method: 'delete',
  path: '/profile',
  summary: 'Delete Account',
  description: 'Deletes the user data (Formizee Dashboard Only).',
  operationId: 'deleteProfile',
  tags: ['Profile'],
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: DeleteProfileSchema
        }
      }
    }
  },
  responses: {
    204: {
      description: 'User deleted successfully',
      content: {
        'text/plain': {
          example: 'Your account has been deleted.',
          schema: z.string()
        }
      }
    },
    400: {
      description: 'Bad Request',
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
      description: 'Profile not found',
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      }
    }
  }
});

export const postProfileLinkedEmailsRoute = createRoute({
  method: 'post',
  path: '/profile/linked-emails',
  summary: 'Add linked emails',
  description: 'Adds another email to the profile linked emails.',
  operationId: 'saveProfileLinkedEmail',
  tags: ['Profile'],
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: PostLinkedEmailsSchema
        }
      }
    }
  },
  responses: {
    201: {
      description: 'Linked email saved successfully',
      content: {
        'application/json': {
          schema: UserSchema
        }
      }
    },
    400: {
      description: 'Bad Request',
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
    403: {
      description: 'Linked emails limit exceeded',
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      }
    },
    404: {
      description: 'Profile not found',
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      }
    },
    409: {
      description: 'Linked email already exists',
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      }
    }
  }
});

export const deleteProfileLinkedEmailsRoute = createRoute({
  method: 'delete',
  path: '/profile/linked-emails/{email}',
  summary: 'Remove linked emails',
  description: 'Deletes a email from the profile linked emails.',
  operationId: 'deleteProfileLinkedEmail',
  tags: ['Profile'],
  request: {
    params: DeleteLinkedEmailsSchema
  },
  responses: {
    204: {
      description: 'Linked email deleted successfully',
      content: {
        'application/json': {
          schema: UserSchema
        }
      }
    },
    400: {
      description: 'Bad Request',
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
      description: 'Linked email not found',
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      }
    },
    409: {
      description: "The default email can't be deleted",
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      }
    }
  }
});
