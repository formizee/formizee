import type {StatusCode} from 'hono/utils/http-status';
import {zValidator} from '@hono/zod-validator';
import {Hono} from 'hono';
import {verifySession} from '@/lib/auth';
import {LoadUserLinkedTeams} from '@/useCases/users';
import {
  UpdateTeamMemberPermissions,
  UpdateTeamMemberRole,
  DeleteTeamMember,
  LoadTeamMembers,
  SaveTeamMember,
  LoadTeamMember,
  DeleteTeam,
  SaveTeam,
  LoadTeam
} from '@/useCases/teams';
import {
  GetTeamSchema,
  PostTeamSchema,
  DeleteTeamSchema,
  GetMembersSchema,
  GetMemberSchema,
  PostMemberParamSchema,
  PostMemberJsonSchema,
  PatchMemberParamSchema,
  PatchMemberJsonSchema,
  DeleteMemberSchema
} from './schema';

export const teams = new Hono();

teams.get('/', async context => {
  const {isAuth, user} = await verifySession(context);

  if (!isAuth || !user) {
    return context.json(
      {error: 'Please, login first in order to do perform action.'},
      401
    );
  }

  const service = new LoadUserLinkedTeams(user.id);
  const response = await service.run();

  return context.json(response.body, response.status as StatusCode);
});

teams.get('/:teamId', zValidator('param', GetTeamSchema), async context => {
  const {isAuth, user} = await verifySession(context);
  const {teamId} = context.req.valid('param');

  if (!isAuth || !user) {
    return context.json(
      {error: 'Please, login first in order to perform this action.'},
      401
    );
  }

  const memberService = new LoadTeamMember(teamId, user.id);
  const memberResponse = await memberService.run();

  if (!memberResponse.ok) {
    return context.json(
      memberResponse.body,
      memberResponse.status as StatusCode
    );
  }

  const teamService = new LoadTeam(teamId);
  const response = await teamService.run();

  return context.json(response.body, response.status as StatusCode);
});

teams.post('/', zValidator('json', PostTeamSchema), async context => {
  const {isAuth, user} = await verifySession(context);
  const {name, ownerId} = context.req.valid('json');

  if (!isAuth || !user) {
    return context.json(
      {error: 'Please, login first in order to perform this action.'},
      401
    );
  }

  const service = new SaveTeam(ownerId, name);
  const response = await service.run();

  return context.json(response.body, response.status as StatusCode);
});

//eslint-disable-next-line -- Drizzle eslint plugin mistake
teams.delete(
  '/:teamId',
  zValidator('param', DeleteTeamSchema),
  async context => {
    const {isAuth, user} = await verifySession(context);
    const {teamId} = context.req.valid('param');

    if (!isAuth || !user) {
      return context.json(
        {error: 'Please, login first in order to perform this action.'},
        401
      );
    }

    const memberService = new LoadTeamMember(teamId, user.id);
    const memberResponse = await memberService.run();
    const member = memberResponse.body;

    if (!memberResponse.ok) {
      return context.json(
        memberResponse.body,
        memberResponse.status as StatusCode
      );
    }

    const loadTeamService = new LoadTeam(teamId);
    const teamResponse = await loadTeamService.run();
    const team = teamResponse.body;

    if (member.role !== 'owner' || member.id !== team.createdBy) {
      return context.json(
        {error: 'You need to be the owner of the team to perform this action.'},
        401
      );
    }

    const deleteTeamService = new DeleteTeam(teamId);
    const response = await deleteTeamService.run();

    return context.json(
      'The team has been deleted.',
      response.status as StatusCode
    );
  }
);

teams.get(
  '/:teamId/members',
  zValidator('param', GetMembersSchema),
  async context => {
    const {isAuth, user} = await verifySession(context);
    const {teamId} = context.req.valid('param');

    if (!isAuth || !user) {
      return context.json(
        {error: 'Please, login first in order to perform this action.'},
        401
      );
    }

    const memberService = new LoadTeamMember(teamId, user.id);
    const memberResponse = await memberService.run();

    if (!memberResponse.ok) {
      return context.json(
        memberResponse.body,
        memberResponse.status as StatusCode
      );
    }

    const service = new LoadTeamMembers(teamId);
    const response = await service.run();

    return context.json(response.body, response.status as StatusCode);
  }
);

teams.get(
  '/:teamId/members/:memberId',
  zValidator('param', GetMemberSchema),
  async context => {
    const {isAuth, user} = await verifySession(context);
    const {teamId, memberId} = context.req.valid('param');

    if (!isAuth || !user) {
      return context.json(
        {error: 'Please, login first in order to perform this action.'},
        401
      );
    }

    const memberService = new LoadTeamMember(teamId, user.id);
    const memberResponse = await memberService.run();

    if (!memberResponse.ok) {
      return context.json(
        memberResponse.body,
        memberResponse.status as StatusCode
      );
    }

    const service = new LoadTeamMember(teamId, memberId);
    const response = await service.run();

    return context.json(response.body, response.status as StatusCode);
  }
);

teams.post(
  '/:teamId/members',
  zValidator('param', PostMemberParamSchema),
  zValidator('json', PostMemberJsonSchema),
  async context => {
    const {isAuth, user} = await verifySession(context);
    const {teamId} = context.req.valid('param');
    const {userId} = context.req.valid('json');

    if (!isAuth || !user) {
      return context.json(
        {error: 'Please, login first in order to perform this action.'},
        401
      );
    }

    const memberService = new LoadTeamMember(teamId, user.id);
    const memberResponse = await memberService.run();
    const userPerformingAction = memberResponse.body;

    if (!memberResponse.ok) {
      return context.json(
        memberResponse.body,
        memberResponse.status as StatusCode
      );
    }

    if (userPerformingAction.role !== 'owner') {
      return context.json(
        {error: 'You need to be the owner of the team to perform this action.'},
        401
      );
    }

    const service = new SaveTeamMember(teamId, userId);
    const response = await service.run();

    return context.json(response.body, response.status as StatusCode);
  }
);

teams.patch(
  '/:teamId/members/:memberId',
  zValidator('param', PatchMemberParamSchema),
  zValidator('json', PatchMemberJsonSchema),
  async context => {
    const {isAuth, user} = await verifySession(context);
    const {teamId, memberId} = context.req.valid('param');
    const request = context.req.valid('json');

    if (!isAuth || !user) {
      return context.json(
        {error: 'Please, login first in order to perform this action.'},
        401
      );
    }

    const memberService = new LoadTeamMember(teamId, user.id);
    const memberResponse = await memberService.run();
    const userPerformingAction = memberResponse.body;

    if (!memberResponse.ok) {
      return context.json(
        memberResponse.body,
        memberResponse.status as StatusCode
      );
    }

    if (userPerformingAction.role !== 'owner') {
      return context.json(
        {error: 'You need to be the owner of the team to perform this action.'},
        401
      );
    }

    if (request.role !== undefined) {
      const service = new UpdateTeamMemberRole(teamId, memberId, request.role);
      await service.run();
    }

    if (request.permissions !== undefined) {
      const service = new UpdateTeamMemberPermissions(
        teamId,
        memberId,
        request.permissions
      );
      await service.run();
    }

    const service = new LoadTeam(teamId);
    const response = await service.run();

    return context.json(response.body, response.status as StatusCode);
  }
);

//eslint-disable-next-line -- Drizzle eslint plugin mistake
teams.delete(
  '/:teamId/members/:memberId',
  zValidator('param', DeleteMemberSchema),
  async context => {
    const {isAuth, user} = await verifySession(context);
    const {teamId, memberId} = context.req.valid('param');

    if (!isAuth || !user) {
      return context.json(
        {error: 'Please, login first in order to perform this action.'},
        401
      );
    }

    const memberService = new LoadTeamMember(teamId, user.id);
    const memberResponse = await memberService.run();
    const userPerformingAction = memberResponse.body;

    if (!memberResponse.ok) {
      return context.json(
        memberResponse.body,
        memberResponse.status as StatusCode
      );
    }

    if (userPerformingAction.role !== 'owner') {
      return context.json(
        {error: 'You need to be the owner of the team to perform this action.'},
        401
      );
    }

    const service = new DeleteTeamMember(teamId, memberId);
    const response = await service.run();

    return context.json(response.body, response.status as StatusCode);
  }
);
