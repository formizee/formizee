import {type EndpointsRepository} from 'domain/repositories';
import {type Email, type Identifier} from 'domain/models/values';
import {Response, Endpoint} from 'domain/models';
import {type DrizzleD1Database, drizzle} from 'drizzle-orm/d1';
import {eq} from 'drizzle-orm';
import {SecretsProvider} from '@/lib/secrets';
import {endpoints, users} from '@/data/models';

export class EndpointsRepositoryImplementation implements EndpointsRepository {
  private readonly db: DrizzleD1Database;

  constructor() {
    const provider = SecretsProvider.getInstance();
    this.db = drizzle(provider.getDb());
  }

  async load(uid: Identifier): Promise<Response<Endpoint>> {
    const response = await this.db
      .select()
      .from(endpoints)
      .where(eq(endpoints.id, uid.value));

    if (!response[0]) return Response.error('Form not found.', 404);

    const endpoint = new Endpoint(
      response[0].id,
      response[0].name,
      response[0].owner,
      response[0].targetEmail,
      response[0].redirectUrl,
      response[0].submissions
    );
    return Response.success(endpoint);
  }

  async loadByOwner(owner: Identifier): Promise<Response<Endpoint[]>> {
    const response = await this.db
      .select()
      .from(endpoints)
      .where(eq(endpoints.owner, owner.value));

    if (!response[0]) {
      return Response.error('The user does not have forms.', 404);
    }

    const result: Endpoint[] = [];

    for (let i = 0; i <= response.length; i++) {
      const endpoint = new Endpoint(
        response[0].id,
        response[0].name,
        response[0].owner,
        response[0].targetEmail,
        response[0].redirectUrl,
        response[0].submissions
      );
      result.push(endpoint);
    }

    return Response.success(result);
  }

  async save(name: string, owner: Identifier): Promise<Response<Endpoint>> {
    const ownerData = await this.db
      .select()
      .from(users)
      .where(eq(users.id, owner.value));
    if (!ownerData[0]) return Response.error('The user does not exist.', 404);

    const response = await this.db
      .insert(endpoints)
      .values({
        name,
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

  delete(_uid: Identifier): Promise<Response<void>> {
    throw Error('Not implemented yet.');
  }

  updateEnabled(
    _uid: Identifier,
    _isEnabled: boolean
  ): Promise<Response<void>> {
    throw Error('Not implemented yet.');
  }

  updateRedirectUrl(
    _uid: Identifier,
    _redirectUrl: URL
  ): Promise<Response<void>> {
    throw Error('Not implemented yet.');
  }

  updateTargetEmail(
    _uid: Identifier,
    _targetEmail: Email
  ): Promise<Response<void>> {
    throw Error('Not implemented yet.');
  }

  updateEmailNotifications(
    _uid: Identifier,
    _isEnabled: boolean
  ): Promise<Response<void>> {
    throw Error('Not implemented yet.');
  }
}
