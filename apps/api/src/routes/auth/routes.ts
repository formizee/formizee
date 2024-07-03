import {createRoute, z} from '@hono/zod-openapi';
import {ErrorSchema, UserSchema} from '@/schemas';
import {
  PostLinkedEmailsSendVerificationSchema,
  PostLoginSchema,
  PostRegisterSchema,
  PostSendVerificationSchema,
  PostVerifyLinkedEmailsSchema,
  PostVerifySchema
} from './schemas';

export const postLoginRoute = createRoute({
  method: 'post',
  path: '/login',
  summary: 'Login',
  description: 'Returns a session cookie if the user is verified.',
  operationId: 'loginAuth',
  tags: ['Authentication'],
  security: [],
  request: {
    body: {
      content: {
        'application/json': {
          schema: PostLoginSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Login successfully',
      content: {
        'application/json': {
          schema: UserSchema
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
    403: {
      description: 'User needs verification',
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      }
    }
  }
});

export const postRegisterRoute = createRoute({
  method: 'post',
  path: '/register',
  summary: 'Register',
  description: 'Creates a new user.',
  operationId: 'registerAuth',
  tags: ['Authentication'],
  security: [],
  request: {
    body: {
      content: {
        'application/json': {
          schema: PostRegisterSchema
        }
      }
    }
  },
  responses: {
    201: {
      description: 'Register successfully',
      content: {
        'application/text': {
          schema: z.string(),
          example: 'Account created successfully.'
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
    409: {
      description: 'Email already in use',
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      }
    }
  }
});

export const postVerifyRoute = createRoute({
  method: 'post',
  path: '/verify',
  summary: 'Verify user',
  description: 'Verifies the user and returns a session cookie.',
  operationId: 'verifyAuth',
  tags: ['Authentication'],
  security: [],
  request: {
    body: {
      content: {
        'application/json': {
          schema: PostVerifySchema
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Verification successfully',
      content: {
        'application/json': {
          schema: z.object({
            user: UserSchema,
            type: z.enum(['account', 'password'])
          })
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
      description: 'Unauthorized',
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

export const postSendVerificationRoute = createRoute({
  method: 'post',
  path: '/send-verification',
  summary: 'Send user verification',
  description: 'Send a email with a token to verify the user identity.',
  operationId: 'sendVerificationAuth',
  tags: ['Authentication'],
  security: [],
  request: {
    body: {
      content: {
        'application/json': {
          schema: PostSendVerificationSchema
        }
      }
    }
  },
  responses: {
    202: {
      description: 'Verification Sended',
      content: {
        'application/text': {
          schema: z.string(),
          example: 'Verification sended successfully.'
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

export const postLinkedEmailsSendVerificationRoute = createRoute({
  method: 'post',
  path: '/linked-emails/send-verification',
  summary: 'Send linked email verification',
  description: 'Send a email with a token to verify a user linked email.',
  operationId: 'sendLinkedEmailVerificationAuth',
  tags: ['Authentication'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: PostLinkedEmailsSendVerificationSchema
        }
      }
    }
  },
  responses: {
    202: {
      description: 'Verification Sended',
      content: {
        'application/text': {
          schema: z.string(),
          example: 'Verification sended successfully.'
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
      description: 'Unauthorized',
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

export const postLinkedEmailsVerifyRoute = createRoute({
  method: 'post',
  path: '/linked-emails/verify',
  summary: 'Linked email verification',
  description: 'Verifies a linked email from the given user.',
  operationId: 'verifyLinkedEmailAuth',
  tags: ['Authentication'],
  security: [],
  request: {
    query: PostVerifyLinkedEmailsSchema
  },
  responses: {
    200: {
      description: 'Verification successfully',
      content: {
        'application/text': {
          schema: z.string(),
          example: 'Linked email successfully verified.'
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
      description: 'Unauthorized',
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

export const postLogoutRoute = createRoute({
  method: 'post',
  path: '/logout',
  summary: 'Logout',
  description: 'Deletes the current session.',
  operationId: 'logoutAuth',
  tags: ['Authentication'],
  responses: {
    200: {
      description: 'Logout successfully',
      content: {
        'application/text': {
          schema: z.string(),
          example: 'User logout successfully.'
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
