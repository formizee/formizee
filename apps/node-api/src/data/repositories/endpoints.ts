import type {EndpointsRepository as Repository} from 'domain/repositories';
import type {Uid, Email} from 'domain/models/values';
import {Response, type Endpoint} from 'domain/models';
import {eq, db, endpoints} from '@db/index';
import {createEndpoint} from '@/lib/utils';

export class EndpointsRepository implements Repository {
  async loadAll(owner: Uid): Promise<Response<Endpoint[]>> {
    const data = await db.query.endpoints.findMany({
      with: {endpoint: owner.value}
    });
    if (data.length < 1) {
      return Response.error('There is no forms yet.', 404);
    }

    const response = data.map(endpoint => {
      return createEndpoint(endpoint);
    });

    return Response.success(response);
  }

  async load(uid: Uid): Promise<Response<Endpoint>> {
    const data = await db.query.endpoints.findFirst({with: {id: uid.value}});
    if (!data) return Response.error('Endpoint not found.', 404);

    const response = createEndpoint(data);

    return Response.success(response);
  }

  async save(
    name: string,
    owner: Uid,
    targetEmail: Email
  ): Promise<Response<Endpoint>> {
    const endpoint = await db
      .insert(endpoints)
      .values({
        name,
        owner: owner.value,
        targetEmail: targetEmail.value
      })
      .returning();

    if (!endpoint[0]) {
      return Response.error("Endpoint can't be created.", 500);
    }

    const response = createEndpoint(endpoint[0]);
    return Response.success(response);
  }

  async delete(uid: Uid): Promise<Response<true>> {
    const userExists = await db.query.endpoints.findFirst({
      with: {id: uid.value}
    });
    if (!userExists) return Response.error('User not found.', 404);

    await db.delete(endpoints).where(eq(endpoints.id, uid.value));

    return Response.success(true);
  }

  async updateEnabled(
    uid: Uid,
    isEnabled: boolean
  ): Promise<Response<Endpoint>> {
    const endpoint = await db.query.endpoints.findFirst({
      with: {id: uid.value}
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
    uid: Uid,
    redirectUrl: URL
  ): Promise<Response<Endpoint>> {
    const endpoint = await db.query.endpoints.findFirst({
      with: {id: uid.value}
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
    uid: Uid,
    targetEmail: Email
  ): Promise<Response<Endpoint>> {
    const endpoint = await db.query.endpoints.findFirst({
      with: {id: uid.value}
    });
    if (!endpoint) return Response.error('Endpoint not found.', 404);

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
    uid: Uid,
    isEnabled: boolean
  ): Promise<Response<Endpoint>> {
    const endpoint = await db.query.endpoints.findFirst({
      with: {id: uid.value}
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
