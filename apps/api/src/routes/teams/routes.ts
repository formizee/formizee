import {ErrorSchema, MemberSchema, TeamSchema} from '@/schemas';
import {createRoute, z} from '@hono/zod-openapi';
import {
  DeleteMemberSchema,
  DeleteTeamSchema,
  GetMemberSchema,
  GetMembersSchema,
  GetTeamSchema,
  PatchMemberJsonSchema,
  PatchMemberParamSchema,
  PostMemberJsonSchema,
  PostMemberParamSchema,
  PostTeamSchema
} from './schemas';

export const getAllTeamsRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'Get all teams',
  description: 'Returns all teams the user is joined to.',
  operationId: 'loadAllTeams',
  tags: ['Teams'],
  responses: {
    200: {
      description: 'Teams loaded successfully',
      content: {
        'application/json': {
          schema: TeamSchema.array()
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

export const getTeamRoute = createRoute({
  method: 'get',
  path: '/{team}',
  summary: 'Get team',
  description: 'Returns the team specified.',
  operationId: 'loadTeam',
  tags: ['Teams'],
  request: {
    params: GetTeamSchema
  },
  responses: {
    200: {
      description: 'Team loaded successfully',
      content: {
        'application/json': {
          schema: TeamSchema
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

export const postTeamRoute = createRoute({
  method: 'post',
  path: '/',
  summary: 'Create team',
  description: 'Creates a new team with the given name.',
  operationId: 'saveTeam',
  tags: ['Teams'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: PostTeamSchema
        }
      }
    }
  },
  responses: {
    201: {
      description: 'Team saved successfully',
      content: {
        'application/json': {
          schema: TeamSchema
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
      description: 'Owner user not found',
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      }
    },
    409: {
      description: 'Team name already exists',
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      }
    }
  }
});

export const deleteTeamRoute = createRoute({
  method: 'delete',
  path: '/{team}',
  summary: 'Delete team',
  description: 'Deletes the team and all its data.',
  operationId: 'deleteTeam',
  tags: ['Teams'],
  request: {
    params: DeleteTeamSchema
  },
  responses: {
    200: {
      description: 'Team deleted successfully',
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
      description: 'Team not found',
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      }
    }
  }
});

export const getAllTeamMembersRoute = createRoute({
  method: 'get',
  path: '/{team}/members',
  summary: 'Get all members',
  description: 'Returns all the members of the specified team.',
  operationId: 'loadAllTeamMembers',
  tags: ['Teams'],
  request: {
    params: GetMembersSchema
  },
  responses: {
    200: {
      description: 'Members loaded successfully',
      content: {
        'application/json': {
          schema: MemberSchema.array()
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

export const getTeamMemberRoute = createRoute({
  method: 'get',
  path: '/{team}/members/{memberId}',
  summary: 'Get member',
  description: 'Returns the member of the specified team.',
  operationId: 'loadTeamMember',
  tags: ['Teams'],
  request: {
    params: GetMemberSchema
  },
  responses: {
    200: {
      description: 'Member loaded successfully',
      content: {
        'application/json': {
          schema: MemberSchema
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
      description: 'Member not found',
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      }
    }
  }
});

export const postTeamMemberRoute = createRoute({
  method: 'post',
  path: '/{team}/members',
  summary: 'Add team member',
  description: 'Adds a member to the specified team.',
  operationId: 'saveTeamMember',
  tags: ['Teams'],
  request: {
    params: PostMemberParamSchema,
    body: {
      required: true,
      content: {
        'application/json': {
          schema: PostMemberJsonSchema
        }
      }
    }
  },
  responses: {
    201: {
      description: 'Member added successfully',
      content: {
        'application/json': {
          schema: MemberSchema
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
    },
    409: {
      description: 'Member is already on the team',
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      }
    }
  }
});

export const patchTeamMemberRoute = createRoute({
  method: 'patch',
  path: '/{team}/members/{memberId}',
  summary: 'Update member permissions',
  description: 'updates member role and permissions for the specified team.',
  operationId: 'updateTeamMember',
  tags: ['Teams'],
  request: {
    params: PatchMemberParamSchema,
    body: {
      content: {
        'application/json': {
          schema: PatchMemberJsonSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Member updated successfully',
      content: {
        'application/json': {
          schema: MemberSchema
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
      description: 'Member not found',
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      }
    }
  }
});

export const deleteTeamMemberRoute = createRoute({
  method: 'delete',
  path: '/{team}/members/{memberId}',
  summary: 'Remove member',
  description: 'Removes the member from the specified team.',
  operationId: 'deleteTeamMember',
  tags: ['Teams'],
  request: {
    params: DeleteMemberSchema
  },
  responses: {
    200: {
      description: 'Member removed successfully',
      content: {
        'text/plain': {
          schema: z.string(),
          example: 'Member has been deleted from the team.'
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
      description: 'Member not found',
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      }
    },
    409: {
      description: 'Conflict',
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      }
    }
  }
});
