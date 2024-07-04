import {OpenAPIHono} from '@hono/zod-openapi';
import {createUUID, memberResponse, teamResponse} from '@/lib/models';
import {handleValidationErrors} from '@/lib/openapi';
import {authentication} from '@/lib/auth';
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

teams.use(getAllTeamsRoute.getRoutingPath(), authentication);
teams.openapi(getAllTeamsRoute, async context => {
  const {user} = context.env?.session as {user: string};

  const service = new LoadUserLinkedTeams(user);
  const teamsData = await service.run();

  if (teamsData.status === 401 || teamsData.status === 404) {
    return context.json(teamsData.error, teamsData.status);
  }

  const response = teamsData.body.map(team => {
    return teamResponse(team);
  });
  return context.json(response, 200);
});

teams.use(getTeamRoute.getRoutingPath(), authentication);
teams.openapi(getTeamRoute, async context => {
  const {user} = context.env?.session as {user: string};
  const {teamId} = context.req.valid('param');
  const teamUUID = createUUID(teamId);

  const memberService = new LoadTeamMember(teamUUID, user);
  const memberData = await memberService.run();

  if (memberData.status === 401 || memberData.status === 404) {
    return context.json(memberData.error, memberData.status);
  }

  const teamService = new LoadTeam(teamUUID);
  const teamData = await teamService.run();

  if (teamData.status === 401 || teamData.status === 404) {
    return context.json(teamData.error, teamData.status);
  }

  const response = teamResponse(teamData.body);
  return context.json(response, 200);
});

teams.use(postTeamRoute.getRoutingPath(), authentication);
teams.openapi(postTeamRoute, async context => {
  const {user} = context.env?.session as {user: string};
  const {name} = context.req.valid('json');

  const service = new SaveTeam(user, name);
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

teams.use(deleteTeamRoute.getRoutingPath(), authentication);
teams.openapi(deleteTeamRoute, async context => {
  const {user} = context.env?.session as {user: string};
  const {teamId} = context.req.valid('param');
  const teamUUID = createUUID(teamId);

  const memberService = new LoadTeamMember(teamUUID, user);
  const memberData = await memberService.run();
  const member = memberData.body;

  if (memberData.status === 401 || memberData.status === 404) {
    return context.json(memberData.error, memberData.status);
  }

  const loadTeamService = new LoadTeam(teamUUID);
  const teamData = await loadTeamService.run();
  const team = teamData.body;

  if (teamData.status === 401 || teamData.status === 404) {
    return context.json(teamData.error, teamData.status);
  }

  if (member.role !== 'owner' || member.id !== team.createdBy) {
    return context.json(
      {
        name: 'Unauthorized',
        description:
          'You need to be the owner of the team to perform this action.'
      },
      401
    );
  }

  const deleteTeamService = new DeleteTeam(teamUUID);
  const response = await deleteTeamService.run();

  if (response.status === 401 || response.status === 404) {
    return context.json(response.error, response.status);
  }

  return context.text('The team has been deleted.', 204);
});

teams.use(getAllTeamMembersRoute.getRoutingPath(), authentication);
teams.openapi(getAllTeamMembersRoute, async context => {
  const {user} = context.env?.session as {user: string};
  const {teamId} = context.req.valid('param');
  const teamUUID = createUUID(teamId);

  const memberService = new LoadTeamMember(teamUUID, user);
  const memberData = await memberService.run();

  if (memberData.status === 401 || memberData.status === 404) {
    return context.json(memberData.error, memberData.status);
  }

  const service = new LoadTeamMembers(teamUUID);
  const membersData = await service.run();

  if (membersData.status === 401 || membersData.status === 404) {
    return context.json(membersData.error, membersData.status);
  }

  const response = membersData.body.map(member => {
    return memberResponse(member);
  });
  return context.json(response, 200);
});

teams.use(getTeamMemberRoute.getRoutingPath(), authentication);
teams.openapi(getTeamMemberRoute, async context => {
  const {user} = context.env?.session as {user: string};
  const {teamId, memberId} = context.req.valid('param');
  const memberUUID = createUUID(memberId);
  const teamUUID = createUUID(teamId);

  const memberService = new LoadTeamMember(teamUUID, user);
  const memberData = await memberService.run();

  if (memberData.status === 401 || memberData.status === 404) {
    return context.json(memberData.error, memberData.status);
  }

  const service = new LoadTeamMember(teamUUID, memberUUID);
  const response = await service.run();

  if (response.status === 401 || response.status === 404) {
    return context.json(response.error, response.status);
  }

  return context.json(memberResponse(response.body), 200);
});

teams.use(postTeamMemberRoute.getRoutingPath(), authentication);
teams.openapi(postTeamMemberRoute, async context => {
  const {user} = context.env?.session as {user: string};
  const {teamId} = context.req.valid('param');
  const {userId} = context.req.valid('json');
  const userUUID = createUUID(userId);
  const teamUUID = createUUID(teamId);

  const memberService = new LoadTeamMember(teamUUID, user);
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

  const service = new SaveTeamMember(teamUUID, userUUID);
  const response = await service.run();

  const error =
    response.status === 401 ||
    response.status === 404 ||
    response.status === 409;
  if (error) {
    return context.json(response.error, response.status);
  }

  return context.json(teamResponse(response.body), 201);
});

teams.use(patchTeamMemberRoute.getRoutingPath(), authentication);
teams.openapi(patchTeamMemberRoute, async context => {
  const {user} = context.env?.session as {user: string};
  const {teamId, memberId} = context.req.valid('param');
  const request = context.req.valid('json');
  const memberUUID = createUUID(memberId);
  const teamUUID = createUUID(teamId);

  const memberService = new LoadTeamMember(teamUUID, user);
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
    const service = new UpdateTeamMemberRole(teamUUID, memberUUID, request.role);

    const response = await service.run();

    if (response.status === 401 || response.status === 404) {
      return context.json(response.error, response.status);
    }
  }

  if (request.permissions !== undefined) {
    const service = new UpdateTeamMemberPermissions(
      teamUUID,
      memberUUID,
      request.permissions
    );

    const response = await service.run();

    if (response.status === 401 || response.status === 404) {
      return context.json(response.error, response.status);
    }
  }

  const service = new LoadTeam(teamUUID);
  const response = await service.run();

  if (response.status === 401 || response.status === 404) {
    return context.json(response.error, response.status);
  }

  return context.json(teamResponse(response.body), 200);
});

teams.use(deleteTeamMemberRoute.getRoutingPath(), authentication);
teams.openapi(deleteTeamMemberRoute, async context => {
  const {user} = context.env?.session as {user: string};
  const {teamId, memberId} = context.req.valid('param');
  const memberUUID = createUUID(memberId);
  const teamUUID = createUUID(teamId);

  const memberService = new LoadTeamMember(teamUUID, user);
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

  const teamService = new LoadTeam(teamUUID);
  const teamData = await teamService.run();

  if (teamData.status === 401 || teamData.status === 404) {
    return context.json(teamData.error, teamData.status);
  }

  const service = new DeleteTeamMember(teamUUID, memberUUID);
  const response = await service.run();

  if (response.status === 401 || response.status === 404) {
    return context.json(response.error, response.status);
  }

  return context.json(teamResponse(teamData.body), 204);
});
