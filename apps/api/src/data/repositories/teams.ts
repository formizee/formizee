import type {TeamsRepository as Repository} from 'domain/repositories';
import type {
  Identifier,
  Email,
  TeamRoles,
  UserPermissions
} from 'domain/models/values';
import {type Member, Response, type Team} from 'domain/models';
import {db, eq, and, users, teams, members} from '@drizzle/db';
import {createMember, createTeam} from 'src/lib/models';

export class TeamsRepository implements Repository {
  async save(owner: Identifier, name: string): Promise<Response<Team>> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, owner.value)
    });
    if (!user) {
      return Response.error('User not found.', 404);
    }

    const alreadyExists = await db.query.teams.findFirst({
      where: eq(teams.name, name)
    });
    if (alreadyExists) {
      return Response.error('The team name is not available.', 409);
    }

    const team = await db
      .insert(teams)
      .values({name, createdBy: user.id})
      .returning();
    if (!team[0]) {
      return Response.error("Team can't be created.", 500);
    }

    await db
      .insert(members)
      .values({
        user: user.id,
        team: team[0].id,
        role: 'owner',
        permissions: 'all'
      })
      .returning();

    const response = createTeam(team[0]);
    return Response.success(response, 201);
  }

  async load(id: Identifier): Promise<Response<Team>> {
    const team = await db.query.teams.findFirst({
      where: eq(teams.id, id.value)
    });
    if (!team) {
      return Response.error('Team not found.', 404);
    }

    const response = createTeam(team);
    return Response.success(response);
  }

  async delete(id: Identifier): Promise<Response<true>> {
    const team = await db.query.teams.findFirst({
      where: eq(teams.id, id.value)
    });
    if (!team) {
      return Response.error('Team not found.', 404);
    }

    const deleted = await db
      .delete(teams)
      .where(eq(teams.id, id.value))
      .returning();
    if (!deleted[0]) {
      return Response.error("Team can't be deleted.", 500);
    }

    return Response.success(true);
  }

  async updateAvailableEmails(
    id: Identifier,
    emails: Email[]
  ): Promise<Response<Team>> {
    const team = await db.query.teams.findFirst({
      where: eq(teams.id, id.value)
    });
    if (!team) {
      return Response.error('Team not found.', 404);
    }

    const availableEmails = emails.map(email => email.value);

    await db.update(teams).set({availableEmails}).where(eq(teams.id, id.value));
    team.availableEmails = availableEmails;

    const response = createTeam(team);
    return Response.success(response);
  }

  async loadMember(
    id: Identifier,
    member: Identifier
  ): Promise<Response<Member>> {
    const teamMember = await db.query.members.findFirst({
      where: and(eq(members.user, member.value), eq(members.team, id.value))
    });
    if (!teamMember) {
      return Response.error('Team Member not found.', 404);
    }

    const response = createMember(teamMember);
    return Response.success(response);
  }

  async saveMember(
    id: Identifier,
    member: Identifier,
    permissions?: UserPermissions,
    role?: TeamRoles
  ): Promise<Response<Team>> {
    const team = await db.query.teams.findFirst({
      where: eq(teams.id, id.value)
    });
    if (!team) {
      return Response.error('Team not found.', 404);
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, member.value)
    });
    if (!user) {
      return Response.error('User not found.', 404);
    }

    const memberAlreadyExists = await db.query.members.findFirst({
      where: and(eq(members.user, user.id), eq(members.team, team.id))
    });
    if (memberAlreadyExists) {
      return Response.error('User already exists in the team.', 409);
    }

    const newMember = await db
      .insert(members)
      .values({
        user: user.id,
        team: team.id,
        role: role ?? 'member',
        permissions: permissions ?? 'read'
      })
      .returning();

    if (!newMember[0]) {
      return Response.error("The member can't be added.", 500);
    }

    const response = createTeam(team);
    return Response.success(response);
  }

  async updateMemberPermissions(
    id: Identifier,
    member: Identifier,
    permissions: UserPermissions
  ): Promise<Response<Team>> {
    const team = await db.query.teams.findFirst({
      where: eq(teams.id, id.value)
    });
    if (!team) {
      return Response.error('Team not found.', 404);
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, member.value)
    });
    if (!user) {
      return Response.error('User not found.', 404);
    }

    const updatedMember = await db
      .update(members)
      .set({permissions})
      .where(and(eq(members.user, user.id), eq(members.team, team.id)))
      .returning();

    if (!updatedMember[0]) {
      return Response.error("Member permissions can't be updated.", 500);
    }

    const response = createTeam(team);
    return Response.success(response);
  }

  async updateMemberRole(
    id: Identifier,
    member: Identifier,
    role: TeamRoles
  ): Promise<Response<Team>> {
    const team = await db.query.teams.findFirst({
      where: eq(teams.id, id.value)
    });
    if (!team) {
      return Response.error('Team not found.', 404);
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, member.value)
    });
    if (!user) {
      return Response.error('User not found.', 404);
    }

    const updatedMember = await db
      .update(members)
      .set({role})
      .where(and(eq(members.user, user.id), eq(members.team, team.id)))
      .returning();

    if (!updatedMember[0]) {
      return Response.error("Member role can't be updated.", 500);
    }

    const response = createTeam(team);
    return Response.success(response);
  }

  async deleteMember(
    id: Identifier,
    member: Identifier
  ): Promise<Response<true>> {
    const team = await db.query.teams.findFirst({
      where: eq(teams.id, id.value)
    });
    if (!team) {
      return Response.error('Team not found.', 404);
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, member.value)
    });
    if (!user) {
      return Response.error('User not found.', 404);
    }

    const memberExists = await db.query.members.findFirst({
      where: and(eq(members.user, user.id), eq(members.team, team.id))
    });
    if (!memberExists) {
      return Response.error('Member not found.', 500);
    }

    const memberIsOwner = team.createdBy === user.id;
    if (memberIsOwner) {
      return Response.error("The team owner can't be deleted.", 409);
    }

    const deletedMember = await db
      .delete(members)
      .where(and(eq(members.user, user.id), eq(members.team, team.id)))
      .returning();

    if (!deletedMember[0]) {
      return Response.error("Member can't be deleted.", 500);
    }

    return Response.success(true);
  }
}
