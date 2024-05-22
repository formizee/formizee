import {EndpointsRepository} from 'domain/repositories';
import {Email, Name, Uid} from 'domain/models/values';
import {Response, Endpoint} from 'domain/models';
import {DatabaseProvider} from '@/lib/db';

import {DrizzleD1Database, drizzle} from 'drizzle-orm/d1';
import {parseLinkedSubmissions} from '@/lib/adapters';
import {endpoints, users} from '../models/schema';
import {eq} from 'drizzle-orm';

export class EndpointsRepositoryImplementation implements EndpointsRepository {
  private readonly db: DrizzleD1Database;

  constructor() {
    const provider = DatabaseProvider.getInstance();
    this.db = drizzle(provider.getDb());
  }

  async load(uid: Uid) {
    const response = await this.db
      .select()
      .from(endpoints)
      .where(eq(endpoints.id, uid.value));

    if (!response[0]) return Response.error('Form not found.', 404);

    const submissions = await parseLinkedSubmissions(response[0].submissions);

    const endpoint = new Endpoint(
      response[0].id,
      response[0].name,
      response[0].owner,
      response[0].targetEmail,
      response[0].redirectUrl,
      submissions
    );
    return Response.success(endpoint);
  }

  async loadByOwner(owner: Uid) {
    const response = await this.db
      .select()
      .from(endpoints)
      .where(eq(endpoints.owner, owner.value));

    if (!response[0])
      return Response.error('The user does not have forms.', 404);

    let result: Endpoint[] = [];

    for (let i = 0; i <= response.length; i++) {
      const submissions = await parseLinkedSubmissions(response[0].submissions);
      const endpoint = new Endpoint(
        response[0].id,
        response[0].name,
        response[0].owner,
        response[0].targetEmail,
        response[0].redirectUrl,
        submissions
      );
      result.push(endpoint);
    }

    return Response.success(result);
  }

  async save(name: Name, owner: Uid) {
    const ownerData = await this.db
      .select()
      .from(users)
      .where(eq(users.id, owner.value));
    if (!ownerData[0]) return Response.error('The user does not exist.', 404);

    const response = await this.db
      .insert(endpoints)
      .values({
        name: name.value,
        owner: owner.value,
        targetEmail: ownerData[0].email
      })
      .returning();

    if (!response[0]) return Response.error('Internal error.', 500);

    const endpoint = new Endpoint(
      response[0].id,
      response[0].name,
      response[0].owner,
      response[0].targetEmail,
      response[0].redirectUrl,
      []
    );
    return Response.success(endpoint);
  }

  async delete(uid: Uid) {}

  async updateEnabled(uid: Uid, isEnabled: boolean) {}

  async updateRedirectUrl(uid: Uid, redirectUrl: URL) {}

  async updateTargetEmail(uid: Uid, targetEmail: Email) {}

  async updateEmailNotifications(uid: Uid, isEnabled: boolean) {}
}
