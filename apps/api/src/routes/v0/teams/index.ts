import {authentication, getAuthentication} from '@/lib/auth';
import {createUUID, memberResponse, teamResponse} from '@/lib/models';
import {handleValidationErrors} from '@/lib/openapi';
import {
  DeleteTeam,
  DeleteTeamMember,
  LoadTeam,
  LoadTeamMember,
  LoadTeamMembers,
  SaveTeam,
  SaveTeamMember,
  UpdateTeamMemberPermissions,
  UpdateTeamMemberRole
} from '@/useCases/teams';
import {LoadUserLinkedTeams} from '@/useCases/users';
import {OpenAPIHono} from '@hono/zod-openapi';
import type {Member} from 'domain/models';
import {
  deleteTeamMemberRoute,
  deleteTeamRoute,
  getAllTeamMembersRoute,
  getAllTeamsRoute,
  getTeamMemberRoute,
  getTeamRoute,
  patchTeamMemberRoute,
  postTeamMemberRoute,
  postTeamRoute
} from './routes';

export const teams = new OpenAPIHono({
  defaultHook: (result, context) => {
    if (!result.success) {
      const error = handleValidationErrors(result.error);
      return context.json(error, 400);
    }
  }
});

teams.use(authentication());

teams.openapi(getAllTeamsRoute, async context => {
  const {userId, scope} = getAuthentication(context);

  if (scope !== 'full-access') {
    return context.json(
      {
        name: 'Unauthorized',
        description:
          'Your API Key does not allow you to do this action, use one with full access instead.'
      },
      401
    );
  }

  const service = new LoadUserLinkedTeams(userId);
  const teamsData = await service.run();

  if (teamsData.status === 401 || teamsData.status === 404) {
    return context.json(teamsData.error, teamsData.status);
  }

  const response = teamsData.body.map(team => {
    return teamResponse(team);
  });
  return context.json(response, 200);
});

teams.openapi(getTeamRoute, async context => {
  const {userId, scope, teamId} = getAuthentication(context);
  const {team} = context.req.valid('param');

  const memberService = new LoadTeamMember(team, userId);
  const memberData = await memberService.run();

  if (memberData.status === 401 || memberData.status === 404) {
    return context.json(memberData.error, memberData.status);
  }

  const teamService = new LoadTeam(team);
  const teamData = await teamService.run();

  if (teamData.status === 401 || teamData.status === 404) {
    return context.json(teamData.error, teamData.status);
  }

  if (scope === 'team' && teamData.body.id !== teamId) {
    return context.json(
      {
        name: 'Unauthorized',
        description:
          'Your API Key scope does not allow you to do this action, create a new one with scope for this team or use one with full access instead.'
      },
      401
    );
  }

  const response = teamResponse(teamData.body);
  return context.json(response, 200);
});

teams.openapi(postTeamRoute, async context => {
  const {userId, scope} = getAuthentication(context);
  const {name} = context.req.valid('json');

  if (scope !== 'full-access') {
    return context.json(
      {
        name: 'Unauthorized',
        description:
          'Your API Key does not allow you to do this action, use one with full access instead.'
      },
      401
    );
  }

  const service = new SaveTeam(userId, name);
  const teamData = await service.run();

  const error =
    teamData.status === 401 ||
    teamData.status === 404 ||
    teamData.status === 409;
  if (error) {
    return context.json(teamData.error, teamData.status);
  }

  const response = teamResponse(teamData.body);
  return context.json(response, 201);
});

teams.openapi(deleteTeamRoute, async context => {
  const {userId, scope, teamId} = getAuthentication(context);
  const {team} = context.req.valid('param');

  const loadTeamService = new LoadTeam(team);
  const teamData = await loadTeamService.run();

  if (teamData.status === 401 || teamData.status === 404) {
    return context.json(teamData.error, teamData.status);
  }

  if (scope === 'team' && teamData.body.id !== teamId) {
    return context.json(
      {
        name: 'Unauthorized',
        description:
          'Your API Key scope does not allow you to do this action, create a new one with scope for this team or use one with full access instead.'
      },
      401
    );
  }

  const memberService = new LoadTeamMember(team, userId);
  const memberData = await memberService.run();
  const member = memberData.body;

  if (memberData.status === 401 || memberData.status === 404) {
    return context.json(memberData.error, memberData.status);
  }

  if (member.role !== 'owner' || member.id !== teamData.body.createdBy) {
    return context.json(
      {
        name: 'Unauthorized',
        description:
          'You need to be the owner of the team to perform this action.'
      },
      401
    );
  }

  const deleteTeamService = new DeleteTeam(team);
  const response = await deleteTeamService.run();

  if (response.status === 401 || response.status === 404) {
    return context.json(response.error, response.status);
  }

  return context.text('The team has been deleted.', 200);
});

teams.openapi(getAllTeamMembersRoute, async context => {
  const {userId, scope, teamId} = getAuthentication(context);
  const {team} = context.req.valid('param');

  const loadTeamService = new LoadTeam(team);
  const teamData = await loadTeamService.run();

  if (teamData.status === 401 || teamData.status === 404) {
    return context.json(teamData.error, teamData.status);
  }

  if (scope === 'team' && teamData.body.id !== teamId) {
    return context.json(
      {
        name: 'Unauthorized',
        description:
          'Your API Key scope does not allow you to do this action, create a new one with scope for this team or use one with full access instead.'
      },
      401
    );
  }

  const memberService = new LoadTeamMember(team, userId);
  const memberData = await memberService.run();

  if (memberData.status === 401 || memberData.status === 404) {
    return context.json(memberData.error, memberData.status);
  }

  const service = new LoadTeamMembers(team);
  const membersData = await service.run();

  if (membersData.status === 401 || membersData.status === 404) {
    return context.json(membersData.error, membersData.status);
  }

  const response = membersData.body.map(member => {
    return memberResponse(member);
  });
  return context.json(response, 200);
});

teams.openapi(getTeamMemberRoute, async context => {
  const {userId, scope, teamId} = getAuthentication(context);
  const {team, memberId} = context.req.valid('param');
  const memberUUID = createUUID(memberId);

  const loadTeamService = new LoadTeam(team);
  const teamData = await loadTeamService.run();

  if (teamData.status === 401 || teamData.status === 404) {
    return context.json(teamData.error, teamData.status);
  }

  if (scope === 'team' && teamData.body.id !== teamId) {
    return context.json(
      {
        name: 'Unauthorized',
        description:
          'Your API Key scope does not allow you to do this action, create a new one with scope for this team or use one with full access instead.'
      },
      401
    );
  }

  const memberService = new LoadTeamMember(team, userId);
  const memberData = await memberService.run();

  if (memberData.status === 401 || memberData.status === 404) {
    return context.json(memberData.error, memberData.status);
  }

  const service = new LoadTeamMember(team, memberUUID);
  const response = await service.run();

  if (response.status === 401 || response.status === 404) {
    return context.json(response.error, response.status);
  }

  return context.json(memberResponse(response.body), 200);
});

teams.openapi(postTeamMemberRoute, async context => {
  const auth = getAuthentication(context);
  const {team} = context.req.valid('param');
  const {userId, role, permissions} = context.req.valid('json');
  const userUUID = createUUID(userId);

  const loadTeamService = new LoadTeam(team);
  const teamData = await loadTeamService.run();

  if (teamData.status === 401 || teamData.status === 404) {
    return context.json(teamData.error, teamData.status);
  }

  if (auth.scope === 'team' && teamData.body.id !== auth.teamId) {
    return context.json(
      {
        name: 'Unauthorized',
        description:
          'Your API Key scope does not allow you to do this action, create a new one with scope for this team or use one with full access instead.'
      },
      401
    );
  }

  const memberService = new LoadTeamMember(team, auth.userId);
  const memberData = await memberService.run();
  const userPerformingAction = memberData.body;

  if (memberData.status === 401 || memberData.status === 404) {
    return context.json(memberData.error, memberData.status);
  }

  if (userPerformingAction.role !== 'owner') {
    return context.json(
      {
        name: 'Unauthorized',
        description:
          'You need to be the owner of the team to perform this action.'
      },
      401
    );
  }

  const service = new SaveTeamMember(team, userUUID, permissions, role);
  const response = await service.run();

  const error =
    response.status === 401 ||
    response.status === 404 ||
    response.status === 409;
  if (error) {
    return context.json(response.error, response.status);
  }

  return context.json(memberResponse(response.body), 201);
});

teams.openapi(patchTeamMemberRoute, async context => {
  const {userId, scope, teamId} = getAuthentication(context);
  const {team, memberId} = context.req.valid('param');
  const request = context.req.valid('json');
  const memberUUID = createUUID(memberId);
  let data: Member | null = null;

  const loadTeamService = new LoadTeam(team);
  const teamData = await loadTeamService.run();

  if (teamData.status === 401 || teamData.status === 404) {
    return context.json(teamData.error, teamData.status);
  }

  if (scope === 'team' && teamData.body.id !== teamId) {
    return context.json(
      {
        name: 'Unauthorized',
        description:
          'Your API Key scope does not allow you to do this action, create a new one with scope for this team or use one with full access instead.'
      },
      401
    );
  }

  const memberService = new LoadTeamMember(team, userId);
  const memberData = await memberService.run();
  const userPerformingAction = memberData.body;

  if (memberData.status === 401 || memberData.status === 404) {
    return context.json(memberData.error, memberData.status);
  }

  if (userPerformingAction.role !== 'owner') {
    return context.json(
      {
        name: 'Unauthorized',
        description:
          'You need to be the owner of the team to perform this action.'
      },
      401
    );
  }

  if (request.role !== undefined) {
    const service = new UpdateTeamMemberRole(team, memberUUID, request.role);

    const response = await service.run();

    if (response.status === 401 || response.status === 404) {
      return context.json(response.error, response.status);
    }

    data = response.body;
  }

  if (request.permissions !== undefined) {
    const service = new UpdateTeamMemberPermissions(
      team,
      memberUUID,
      request.permissions
    );

    const response = await service.run();

    if (response.status === 401 || response.status === 404) {
      return context.json(response.error, response.status);
    }

    data = response.body;
  }

  const service = new LoadTeam(team);
  const response = await service.run();

  if (response.status === 401 || response.status === 404) {
    return context.json(response.error, response.status);
  }

  const hasEmptyValues =
    request.role === undefined && request.permissions === undefined;

  if (hasEmptyValues || data === null) {
    return context.json(
      {
        name: 'Bad Request',
        description:
          "At least provide one of the following fields: 'role', 'permissions'"
      },
      400
    );
  }

  return context.json(memberResponse(data), 200);
});

teams.openapi(deleteTeamMemberRoute, async context => {
  const {userId, scope, teamId} = getAuthentication(context);
  const {team, memberId} = context.req.valid('param');
  const memberUUID = createUUID(memberId);

  const teamService = new LoadTeam(team);
  const teamData = await teamService.run();

  if (teamData.status === 401 || teamData.status === 404) {
    return context.json(teamData.error, teamData.status);
  }

  if (scope === 'team' && teamData.body.id !== teamId) {
    return context.json(
      {
        name: 'Unauthorized',
        description:
          'Your API Key scope does not allow you to do this action, create a new one with scope for this team or use one with full access instead.'
      },
      401
    );
  }

  const memberService = new LoadTeamMember(team, userId);
  const memberData = await memberService.run();
  const userPerformingAction = memberData.body;

  if (memberData.status === 401 || memberData.status === 404) {
    return context.json(memberData.error, memberData.status);
  }

  if (userPerformingAction.role !== 'owner') {
    return context.json(
      {
        name: 'Unauthorized',
        description:
          'You need to be the owner of the team to perform this action.'
      },
      401
    );
  }

  const service = new DeleteTeamMember(team, memberUUID);
  const response = await service.run();

  if (
    response.status === 401 ||
    response.status === 404 ||
    response.status === 409
  ) {
    return context.json(response.error, response.status);
  }

  return context.text('Member has been deleted from the team', 200);
});
