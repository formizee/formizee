import type {TeamsRepository as Repository} from 'domain/repositories';
import type {
  Identifier,
  Email,
  TeamRoles,
  UserPermissions
} from 'domain/models/values';
import {type Member, Response, type Team} from 'domain/models';
import {db, eq, and, users, teams, members, linkedEmails} from '@drizzle/db';
import {createMember, createTeam} from 'src/lib/models';

export class TeamsRepository implements Repository {
  async save(owner: Identifier, name: string): Promise<Response<Team>> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, owner.value)
    });
    if (!user) {
      return Response.error(
        {
          name: 'Not found',
          description: 'User not found.'
        },
        404
      );
    }

    const alreadyExists = await db.query.teams.findFirst({
      where: eq(teams.name, name)
    });
    if (alreadyExists) {
      return Response.error(
        {
          name: 'Not available',
          description: 'The team name is not available.'
        },
        409
      );
    }

    const emails = await db.query.linkedEmails.findMany({
      where: and(
        eq(linkedEmails.user, user.id),
        eq(linkedEmails.isVerified, true)
      )
    });

    const availableEmails = emails.map(email => {
      return email.email;
    });

    const team = await db
      .insert(teams)
      .values({name, availableEmails, createdBy: user.id})
      .returning();
    if (!team[0]) {
      return Response.error(
        {
          name: 'Internal error',
          description: "Team can't be created."
        },
        500
      );
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
      return Response.error(
        {
          name: 'Not found',
          description: 'Team not found.'
        },
        404
      );
    }

    const response = createTeam(team);
    return Response.success(response);
  }

  async delete(id: Identifier): Promise<Response<true>> {
    const team = await db.query.teams.findFirst({
      where: eq(teams.id, id.value)
    });
    if (!team) {
      return Response.error(
        {
          name: 'Not found',
          description: 'Team not found.'
        },
        404
      );
    }

    const deleted = await db
      .delete(teams)
      .where(eq(teams.id, id.value))
      .returning();
    if (!deleted[0]) {
      return Response.error(
        {
          name: 'Internal error',
          description: "Team can't be deleted."
        },
        500
      );
    }

    return Response.success(true);
  }

  async saveAvailableEmail(
    id: Identifier,
    email: Email
  ): Promise<Response<Team>> {
    const team = await db.query.teams.findFirst({
      where: eq(teams.id, id.value)
    });
    if (!team) {
      return Response.error(
        {
          name: 'Not found',
          description: 'Team not found.'
        },
        404
      );
    }

    const alreadyExists = team.availableEmails.some(
      availableEmail => availableEmail === email.value
    );
    if (alreadyExists) {
      return Response.error(
        {
          name: 'Conflict',
          description: 'The email is already in the list.'
        },
        409
      );
    }

    const availableEmails = team.availableEmails;
    availableEmails.push(email.value);

    await db.update(teams).set({availableEmails}).where(eq(teams.id, id.value));
    team.availableEmails = availableEmails;

    const response = createTeam(team);
    return Response.success(response);
  }

  async deleteAvailableEmail(
    id: Identifier,
    email: Email
  ): Promise<Response<Team>> {
    const team = await db.query.teams.findFirst({
      where: eq(teams.id, id.value)
    });
    if (!team) {
      return Response.error(
        {
          name: 'Not found',
          description: 'Team not found.'
        },
        404
      );
    }

    const emailExists = team.availableEmails.some(
      availableEmail => availableEmail === email.value
    );
    if (!emailExists) {
      return Response.error(
        {
          name: 'Not found',
          description: 'Email not found in the list.'
        },
        404
      );
    }

    const availableEmails = team.availableEmails.filter(
      availableEmail => availableEmail !== email.value
    );

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
      return Response.error(
        {
          name: 'Not found',
          description: 'Team member not found.'
        },
        404
      );
    }

    const response = createMember(teamMember);
    return Response.success(response);
  }

  async loadMembers(id: Identifier): Promise<Response<Member[]>> {
    const teamMembers = await db.query.members.findMany({
      where: eq(members.team, id.value)
    });

    const response = teamMembers.map(member => {
      return createMember(member);
    });

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
      return Response.error(
        {
          name: 'Not found',
          description: 'Team not found.'
        },
        404
      );
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, member.value),
      with: {linkedEmails: true}
    });
    if (!user) {
      return Response.error(
        {
          name: 'Not found',
          description: 'User not found.'
        },
        404
      );
    }

    const memberAlreadyExists = await db.query.members.findFirst({
      where: and(eq(members.user, user.id), eq(members.team, team.id))
    });
    if (memberAlreadyExists) {
      return Response.error(
        {
          name: 'Conflict',
          description: 'User already exists in the team.'
        },
        409
      );
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
      return Response.error(
        {
          name: 'Internal error',
          description: "The member can't be added."
        },
        500
      );
    }

    const newAvailableEmails = team.availableEmails;
    user.linkedEmails.forEach(linkedEmail => {
      newAvailableEmails.push(linkedEmail.email);
    });

    await db
      .update(teams)
      .set({
        availableEmails: newAvailableEmails
      })
      .where(eq(teams.id, team.id));

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
      return Response.error(
        {
          name: 'Not found',
          description: 'Team not found.'
        },
        404
      );
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, member.value)
    });
    if (!user) {
      return Response.error(
        {
          name: 'Not found',
          description: 'User not found.'
        },
        404
      );
    }

    const updatedMember = await db
      .update(members)
      .set({permissions})
      .where(and(eq(members.user, user.id), eq(members.team, team.id)))
      .returning();

    if (!updatedMember[0]) {
      return Response.error(
        {
          name: 'Internal error',
          description: "Member permissions can't be updated."
        },
        500
      );
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
      return Response.error(
        {
          name: 'Not found',
          description: 'Team not found.'
        },
        404
      );
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, member.value)
    });
    if (!user) {
      return Response.error(
        {
          name: 'Not found',
          description: 'User not found.'
        },
        404
      );
    }

    const updatedMember = await db
      .update(members)
      .set({role})
      .where(and(eq(members.user, user.id), eq(members.team, team.id)))
      .returning();

    if (!updatedMember[0]) {
      return Response.error(
        {
          name: 'Internal error',
          description: "Member role can't be updated."
        },
        404
      );
    }

    const response = createTeam(team);
    return Response.success(response);
  }

  async deleteMember(
    id: Identifier,
    member: Identifier
  ): Promise<Response<Team>> {
    const team = await db.query.teams.findFirst({
      where: eq(teams.id, id.value)
    });
    if (!team) {
      return Response.error(
        {
          name: 'Not found',
          description: 'Team not found.'
        },
        404
      );
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, member.value),
      with: {linkedEmails: true}
    });
    if (!user) {
      return Response.error(
        {
          name: 'Not found',
          description: 'User not found.'
        },
        404
      );
    }

    const memberExists = await db.query.members.findFirst({
      where: and(eq(members.user, user.id), eq(members.team, team.id))
    });
    if (!memberExists) {
      return Response.error(
        {
          name: 'Not found',
          description: 'Member not found.'
        },
        404
      );
    }

    const memberIsOwner = team.createdBy === user.id;
    if (memberIsOwner) {
      return Response.error(
        {
          name: 'Conflict',
          description: "The team owner can't be deleted."
        },
        409
      );
    }

    const deletedMember = await db
      .delete(members)
      .where(and(eq(members.user, user.id), eq(members.team, team.id)))
      .returning();

    if (!deletedMember[0]) {
      return Response.error(
        {
          name: 'Internal Error',
          description: "Member can't be deleted."
        },
        500
      );
    }

    const linkedEmailsData = user.linkedEmails.map(
      linkedEmail => linkedEmail.email
    );
    const newAvailableEmails = team.availableEmails.filter(
      email => !linkedEmailsData.includes(email)
    );

    await db
      .update(teams)
      .set({
        availableEmails: newAvailableEmails
      })
      .where(eq(teams.id, team.id));

    const response = createTeam(team);
    return Response.success(response);
  }
}
