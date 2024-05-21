import {EndpointsRepository} from 'domain/repositories';
import {Response, Endpoint, Submission} from 'domain/models';
import {Email, Name, Uid} from 'domain/models/values';

import {DatabaseConfigProvider} from '@/lib/database';
import {drizzle} from 'drizzle-orm/d1';
import {endpoints, users} from '../models/schema';
import {eq} from 'drizzle-orm';
import {parseLinkedSubmissions} from '@/lib/models';

export class EndpointsRepositoryImplementation implements EndpointsRepository {
  private readonly db: any;

  constructor() {
    const configProvider = DatabaseConfigProvider.getInstance();
    const dbBinding = configProvider.getDb();
    this.db = drizzle(dbBinding);
  }

  async delete(uid: Uid) {}

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

  async addSubmission(uid: Uid, submission: Submission) {}

  async updateTargetEmail(uid: Uid, targetEmail: Email) {}

  async updateRedirectUrl(uid: Uid, redirectUrl: URL) {}

  async updateEnabled(uid: Uid, isEnabled: boolean) {}

  async updateEmailNotifications(uid: Uid, isEnabled: boolean) {}
}
