import type {EndpointsRepository as Repository} from 'domain/repositories';
import type {Identifier, Email} from 'domain/models/values';
import {Response, type Endpoint} from 'domain/models';
import {eq, db, endpoints, users, teams} from '@drizzle/db';
import {createEndpoint} from '@/lib/utils';

export class EndpointsRepository implements Repository {
  async loadAll(team: Identifier): Promise<Response<Endpoint[]>> {
    const data = await db.query.endpoints.findMany({
      where: eq(endpoints.team, team.value)
    });
    if (data.length < 1) {
      return Response.error('There is no forms yet.', 404);
    }

    const response = data.map(endpoint => {
      return createEndpoint(endpoint);
    });

    return Response.success(response);
  }

  async load(id: Identifier): Promise<Response<Endpoint>> {
    const data = await db.query.endpoints.findFirst({
      where: eq(endpoints.id, id.value)
    });
    if (!data) {
      return Response.error('Endpoint not found.', 404);
    }

    const response = createEndpoint(data);

    return Response.success(response);
  }

  async save(name: string, team: Identifier): Promise<Response<Endpoint>> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, team.value)
    });
    if (!user) {
      return Response.error('User not exits', 404);
    }

    const endpoint = await db
      .insert(endpoints)
      .values({
        name,
        team: team.value,
        targetEmails: [user.email]
      })
      .returning();

    if (!endpoint[0]) {
      return Response.error("Endpoint can't be created.", 500);
    }

    const response = createEndpoint(endpoint[0]);
    return Response.success(response);
  }

  async delete(id: Identifier): Promise<Response<true>> {
    const endpoint = await db.query.endpoints.findFirst({
      where: eq(endpoints.id, id.value)
    });

    if (!endpoint) {
      return Response.error('Endpoint not found.', 404);
    }

    await db.delete(endpoints).where(eq(endpoints.id, id.value));

    return Response.success(true);
  }

  async updateName(id: Identifier, name: string): Promise<Response<Endpoint>> {
    const endpoint = await db.query.endpoints.findFirst({
      where: eq(endpoints.id, id.value)
    });
    if (!endpoint) return Response.error('Endpoint not found.', 404);

    const data = await db
      .update(endpoints)
      .set({name})
      .where(eq(endpoints.id, id.value))
      .returning({updatedName: endpoints.name});
    if (!data[0]) {
      return Response.error("Endpoint name can't be updated", 500);
    }

    endpoint.name = data[0].updatedName;
    const response = createEndpoint(endpoint);

    return Response.success(response);
  }

  async updateEnabled(
    id: Identifier,
    isEnabled: boolean
  ): Promise<Response<Endpoint>> {
    const endpoint = await db.query.endpoints.findFirst({
      where: eq(endpoints.id, id.value)
    });
    if (!endpoint) return Response.error('Endpoint not found.', 404);

    const data = await db
      .update(endpoints)
      .set({isEnabled})
      .where(eq(endpoints.id, id.value))
      .returning({updatedIsEnabled: endpoints.isEnabled});
    if (!data[0]) {
      return Response.error("Endpoint status can't be updated", 500);
    }

    endpoint.isEnabled = data[0].updatedIsEnabled;
    const response = createEndpoint(endpoint);

    return Response.success(response);
  }

  async updateRedirectUrl(
    id: Identifier,
    redirectUrl: URL
  ): Promise<Response<Endpoint>> {
    const endpoint = await db.query.endpoints.findFirst({
      where: eq(endpoints.id, id.value)
    });
    if (!endpoint) return Response.error('Endpoint not found.', 404);

    const data = await db
      .update(endpoints)
      .set({redirectUrl: redirectUrl.href})
      .where(eq(endpoints.id, id.value))
      .returning({updatedRedirectUrl: endpoints.redirectUrl});
    if (!data[0]) {
      return Response.error("Endpoint redirectUrl can't be updated", 500);
    }

    endpoint.redirectUrl = data[0].updatedRedirectUrl;
    const response = createEndpoint(endpoint);

    return Response.success(response);
  }

  async updateEmailNotifications(
    id: Identifier,
    isEnabled: boolean
  ): Promise<Response<Endpoint>> {
    const endpoint = await db.query.endpoints.findFirst({
      where: eq(endpoints.id, id.value)
    });
    if (!endpoint) return Response.error('Endpoint not found.', 404);

    const data = await db
      .update(endpoints)
      .set({emailNotifications: isEnabled})
      .where(eq(endpoints.id, id.value))
      .returning({updatedEmailNotifications: endpoints.emailNotifications});
    if (!data[0]) {
      return Response.error(
        "Endpoint emailNotifications can't be updated",
        500
      );
    }

    endpoint.emailNotifications = data[0].updatedEmailNotifications;
    const response = createEndpoint(endpoint);

    return Response.success(response);
  }

  async addTargetEmail(
    id: Identifier,
    email: Email
  ): Promise<Response<Endpoint>> {
    const endpoint = await db.query.endpoints.findFirst({
      where: eq(endpoints.id, id.value)
    });

    if (!endpoint) {
      return Response.error('Endpoint not found.', 404);
    }

    const team = await db.query.teams.findFirst({
      where: eq(teams.id, endpoint.team)
    });

    if (!team) {
      return Response.error('Endpoint owner not found.', 404);
    }

    const targetEmailExists = team.availableEmails.some(
      availableEmail => availableEmail === email.value
    );
    if (!targetEmailExists) {
      return Response.error(
        'The email needs to be one of the team available emails.',
        401
      );
    }

    const targetEmailAlreadyUsed = endpoint.targetEmails.some(
      targetEmail => targetEmail === email.value
    );
    if (targetEmailAlreadyUsed) {
      return Response.error(
        'The target email is already assigned to this endpoint.',
        409
      );
    }

    const targetEmails = endpoint.targetEmails;
    targetEmails.push(email.value);

    await db
      .update(endpoints)
      .set({targetEmails})
      .where(eq(endpoints.id, id.value));

    endpoint.targetEmails = targetEmails;
    const response = createEndpoint(endpoint);

    return Response.success(response);
  }

  async deleteTargetEmail(
    id: Identifier,
    email: Email
  ): Promise<Response<Endpoint>> {
    const endpoint = await db.query.endpoints.findFirst({
      where: eq(endpoints.id, id.value)
    });

    if (!endpoint) {
      return Response.error('Endpoint not found.', 404);
    }

    const targetEmailExists = endpoint.targetEmails.some(
      targetEmail => targetEmail === email.value
    );
    if (!targetEmailExists) {
      return Response.error('The email does not exists.', 404);
    }

    if (endpoint.targetEmails.length <= 1) {
      return Response.error('At least one target email is needed.', 409);
    }

    const targetEmails = endpoint.targetEmails.filter(
      targetEmail => targetEmail !== email.value
    );

    await db
      .update(endpoints)
      .set({targetEmails})
      .where(eq(endpoints.id, id.value));

    endpoint.targetEmails = targetEmails;
    const response = createEndpoint(endpoint);

    return Response.success(response);
  }
}
