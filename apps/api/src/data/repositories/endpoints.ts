import type {EndpointsRepository as Repository} from 'domain/repositories';
import type {Name, Identifier, Email} from 'domain/models/values';
import {Response, type Endpoint} from 'domain/models';
import {eq, db, endpoints, teams} from '@drizzle/db';
import {createEndpoint} from 'src/lib/models';

export class EndpointsRepository implements Repository {
  async loadAll(teamSlug: Name): Promise<Response<Endpoint[]>> {
    const team = await db.query.teams.findFirst({
      where: eq(teams.name, teamSlug.value)
    });
    if (!team) {
      return Response.error({
        name: 'Not found',
        description: 'Team not found.'
      });
    }

    const data = await db.query.endpoints.findMany({
      where: eq(endpoints.team, team.id)
    });
    if (data.length < 1) {
      return Response.success([]);
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
      return Response.error(
        {
          name: 'Not found',
          description: 'Endpoint not found.'
        },
        404
      );
    }

    const response = createEndpoint(data);

    return Response.success(response);
  }

  async save(
    name: string,
    teamSlug: Name,
    targetEmails: Email[]
  ): Promise<Response<Endpoint>> {
    const team = await db.query.teams.findFirst({
      where: eq(teams.name, teamSlug.value)
    });
    if (!team) {
      return Response.error({
        name: 'Not found',
        description: 'Team not found.'
      });
    }

    const emails = targetEmails.map(email => email.value);

    const endpoint = await db
      .insert(endpoints)
      .values({
        name,
        team: team.id,
        targetEmails: emails
      })
      .returning();

    if (!endpoint[0]) {
      return Response.error(
        {
          name: 'Internal error',
          description: "Endpoint can't be created."
        },
        500
      );
    }

    const response = createEndpoint(endpoint[0]);
    return Response.success(response);
  }

  async delete(id: Identifier): Promise<Response<true>> {
    const endpoint = await db.query.endpoints.findFirst({
      where: eq(endpoints.id, id.value)
    });

    if (!endpoint) {
      return Response.error(
        {
          name: 'Not found',
          description: 'Endpoint not found.'
        },
        404
      );
    }

    await db.delete(endpoints).where(eq(endpoints.id, id.value));

    return Response.success(true);
  }

  async updateName(id: Identifier, name: string): Promise<Response<Endpoint>> {
    const endpoint = await db.query.endpoints.findFirst({
      where: eq(endpoints.id, id.value)
    });
    if (!endpoint) {
      return Response.error(
        {
          name: 'Not found',
          description: 'Endpoint not found.'
        },
        404
      );
    }

    const data = await db
      .update(endpoints)
      .set({name})
      .where(eq(endpoints.id, id.value))
      .returning({updatedName: endpoints.name});
    if (!data[0]) {
      return Response.error(
        {
          name: 'Internal error',
          description: "Endpoint name can't be updated."
        },
        500
      );
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
    if (!endpoint) {
      return Response.error(
        {
          name: 'Not found',
          description: 'Endpoint not found.'
        },
        404
      );
    }

    const data = await db
      .update(endpoints)
      .set({isEnabled})
      .where(eq(endpoints.id, id.value))
      .returning({updatedIsEnabled: endpoints.isEnabled});
    if (!data[0]) {
      return Response.error(
        {
          name: 'Internal error',
          description: "Endpoint status can't be updated."
        },
        500
      );
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
    if (!endpoint) {
      return Response.error(
        {
          name: 'Not found',
          description: 'Endpoint not found.'
        },
        404
      );
    }

    const data = await db
      .update(endpoints)
      .set({redirectUrl: redirectUrl.href})
      .where(eq(endpoints.id, id.value))
      .returning({updatedRedirectUrl: endpoints.redirectUrl});
    if (!data[0]) {
      return Response.error(
        {
          name: 'Internal error',
          description: "Endpoint redirect url can't be updated."
        },
        500
      );
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
    if (!endpoint) {
      return Response.error(
        {
          name: 'Not found',
          description: 'Endpoint not found.'
        },
        404
      );
    }

    const data = await db
      .update(endpoints)
      .set({emailNotifications: isEnabled})
      .where(eq(endpoints.id, id.value))
      .returning({updatedEmailNotifications: endpoints.emailNotifications});
    if (!data[0]) {
      return Response.error(
        {
          name: 'Internal error',
          description: "Endpoint email notifications can't be updated."
        },
        500
      );
    }

    endpoint.emailNotifications = data[0].updatedEmailNotifications;
    const response = createEndpoint(endpoint);

    return Response.success(response);
  }

  async updateTargetEmails(
    id: Identifier,
    emails: Email[]
  ): Promise<Response<Endpoint>> {
    const endpoint = await db.query.endpoints.findFirst({
      where: eq(endpoints.id, id.value)
    });

    if (!endpoint) {
      return Response.error(
        {
          name: 'Not found',
          description: 'Endpoint not found.'
        },
        404
      );
    }

    const team = await db.query.teams.findFirst({
      where: eq(teams.id, endpoint.team)
    });

    if (!team) {
      return Response.error(
        {
          name: 'Not found',
          description: 'Endpoint owner not found.'
        },
        404
      );
    }

    const validEmails = (): boolean => {
      for (const email of emails) {
        const available = team.availableEmails.some(
          item => item === email.value
        );
        if (!available) return false;
      }
      return true;
    };

    if (!validEmails()) {
      return Response.error(
        {
          name: 'Unauthorized',
          description:
            'The target email needs to be one of the team available emails.'
        },
        401
      );
    }

    const newTargetEmails = emails.map(email => {
      return email.value;
    });

    await db
      .update(endpoints)
      .set({targetEmails: newTargetEmails})
      .where(eq(endpoints.id, id.value));

    endpoint.targetEmails = newTargetEmails;
    const response = createEndpoint(endpoint);

    return Response.success(response);
  }
}
