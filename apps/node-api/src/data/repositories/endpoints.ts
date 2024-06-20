import type {EndpointsRepository as Repository} from 'domain/repositories';
import type {Identifier, Email} from 'domain/models/values';
import {Response, type Endpoint} from 'domain/models';
import {eq, db, endpoints, users} from '@drizzle/db';
import {createEndpoint} from '@/lib/utils';

export class EndpointsRepository implements Repository {
  async loadAll(owner: Identifier): Promise<Response<Endpoint[]>> {
    const data = await db.query.endpoints.findMany({
      where: eq(endpoints.owner, owner.value)
    });
    if (data.length < 1) {
      return Response.error('There is no forms yet.', 404);
    }

    const response = data.map(endpoint => {
      return createEndpoint(endpoint);
    });

    return Response.success(response);
  }

  async load(uid: Identifier): Promise<Response<Endpoint>> {
    const data = await db.query.endpoints.findFirst({
      where: eq(endpoints.id, uid.value)
    });
    if (!data) {
      return Response.error('Endpoint not found.', 404);
    }

    const response = createEndpoint(data);

    return Response.success(response);
  }

  async save(name: string, owner: Identifier): Promise<Response<Endpoint>> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, owner.value)
    });
    if (!user) {
      return Response.error('User not exits', 404);
    }

    const endpoint = await db
      .insert(endpoints)
      .values({
        name,
        owner: owner.value,
        targetEmail: user.email
      })
      .returning();

    if (!endpoint[0]) {
      return Response.error("Endpoint can't be created.", 500);
    }

    const forms = user.forms;
    forms.push(endpoint[0].id);

    await db.update(users).set({forms}).where(eq(users.id, user.id));

    const response = createEndpoint(endpoint[0]);
    return Response.success(response);
  }

  async delete(uid: Identifier): Promise<Response<true>> {
    const endpoint = await db.query.endpoints.findFirst({
      where: eq(endpoints.id, uid.value)
    });

    if (!endpoint) {
      return Response.error('Endpoint not found.', 404);
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, endpoint.owner)
    });

    if (!user) {
      return Response.error('The endpoint does not have owner.', 404);
    }

    await db.delete(endpoints).where(eq(endpoints.id, uid.value));

    const forms = user.forms.filter(form => form !== endpoint.id);
    await db.update(users).set({forms}).where(eq(users.id, user.id));

    return Response.success(true);
  }

  async updateName(uid: Identifier, name: string): Promise<Response<Endpoint>> {
    const endpoint = await db.query.endpoints.findFirst({
      where: eq(endpoints.id, uid.value)
    });
    if (!endpoint) return Response.error('Endpoint not found.', 404);

    const data = await db
      .update(endpoints)
      .set({name})
      .where(eq(endpoints.id, uid.value))
      .returning({updatedName: endpoints.name});
    if (!data[0]) {
      return Response.error("Endpoint name can't be updated", 500);
    }

    endpoint.name = data[0].updatedName;
    const response = createEndpoint(endpoint);

    return Response.success(response);
  }

  async updateEnabled(
    uid: Identifier,
    isEnabled: boolean
  ): Promise<Response<Endpoint>> {
    const endpoint = await db.query.endpoints.findFirst({
      where: eq(endpoints.id, uid.value)
    });
    if (!endpoint) return Response.error('Endpoint not found.', 404);

    const data = await db
      .update(endpoints)
      .set({isEnabled})
      .where(eq(endpoints.id, uid.value))
      .returning({updatedIsEnabled: endpoints.isEnabled});
    if (!data[0]) {
      return Response.error("Endpoint status can't be updated", 500);
    }

    endpoint.isEnabled = data[0].updatedIsEnabled;
    const response = createEndpoint(endpoint);

    return Response.success(response);
  }

  async updateRedirectUrl(
    uid: Identifier,
    redirectUrl: URL
  ): Promise<Response<Endpoint>> {
    const endpoint = await db.query.endpoints.findFirst({
      where: eq(endpoints.id, uid.value)
    });
    if (!endpoint) return Response.error('Endpoint not found.', 404);

    const data = await db
      .update(endpoints)
      .set({redirectUrl: redirectUrl.href})
      .where(eq(endpoints.id, uid.value))
      .returning({updatedRedirectUrl: endpoints.redirectUrl});
    if (!data[0]) {
      return Response.error("Endpoint redirectUrl can't be updated", 500);
    }

    endpoint.redirectUrl = data[0].updatedRedirectUrl;
    const response = createEndpoint(endpoint);

    return Response.success(response);
  }

  async updateTargetEmail(
    uid: Identifier,
    targetEmail: Email
  ): Promise<Response<Endpoint>> {
    const endpoint = await db.query.endpoints.findFirst({
      where: eq(endpoints.id, uid.value)
    });

    if (!endpoint) {
      return Response.error('Endpoint not found.', 404);
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, endpoint.owner)
    });

    if (!user) {
      return Response.error('Endpoint owner not found.', 404);
    }

    const targetEmailExists = user.linkedEmails.some(
      linkedEmail => linkedEmail.email === targetEmail.value
    );
    if (!targetEmailExists) {
      return Response.error(
        'The target email needs to be one of the owner linked emails.',
        401
      );
    }

    const validTargetEmail = user.linkedEmails.some(
      linkedEmail =>
        linkedEmail.email === targetEmail.value && linkedEmail.isVerified
    );
    if (!validTargetEmail) {
      return Response.error(
        'The target email is not verified, please verify the email before using it',
        401
      );
    }

    const targetEmailAlreadyUsed = targetEmail.value === endpoint.targetEmail;
    if (targetEmailAlreadyUsed) {
      return Response.error(
        'The target email is already being used in this form.',
        409
      );
    }

    const data = await db
      .update(endpoints)
      .set({targetEmail: targetEmail.value})
      .where(eq(endpoints.id, uid.value))
      .returning({updatedTargetEmail: endpoints.targetEmail});
    if (!data[0]) {
      return Response.error("Endpoint targetEmail can't be updated", 500);
    }

    endpoint.targetEmail = data[0].updatedTargetEmail;
    const response = createEndpoint(endpoint);

    return Response.success(response);
  }

  async updateEmailNotifications(
    uid: Identifier,
    isEnabled: boolean
  ): Promise<Response<Endpoint>> {
    const endpoint = await db.query.endpoints.findFirst({
      where: eq(endpoints.id, uid.value)
    });
    if (!endpoint) return Response.error('Endpoint not found.', 404);

    const data = await db
      .update(endpoints)
      .set({emailNotifications: isEnabled})
      .where(eq(endpoints.id, uid.value))
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
}
