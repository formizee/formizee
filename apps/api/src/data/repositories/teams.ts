import type {TeamsRepository as Repository} from 'domain/repositories';
import type {Identifier, Email} from 'domain/models/values';
import {Response, type Team} from 'domain/models';
import {db, eq, users, teams, members} from '@drizzle/db';
import {createTeam} from '@/lib/utils';

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

    const team = await db.insert(teams).values({name}).returning();
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
    if (!deleted) {
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
}
