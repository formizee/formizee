import type {APIKeysRepository as Repository} from 'domain/repositories';
import type {
  Identifier,
  APIKeyScope,
  Name,
  APIKeyExpirationDate
} from 'domain/models/values';
import {type APIKey, Response} from 'domain/models';
import {and, apiKeys, db, eq, members, teams, users} from '@drizzle/db';
import {createAPIKey} from '@/lib/models';
import {
  generateAPIKey,
  generateExpirationDate,
  getAPIKeyHash
} from '@/lib/auth/api-keys';

export class APIKeysRepository implements Repository {
  async loadAll(userId: Identifier): Promise<Response<APIKey[]>> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId.value)
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

    const keys = await db.query.apiKeys.findMany({
      where: eq(apiKeys.user, user.id)
    });

    const response = keys.map(key => {
      return createAPIKey(key);
    });

    return Response.success(response);
  }

  async save(
    userId: Identifier,
    scope: APIKeyScope,
    expirationDate: APIKeyExpirationDate,
    teamSlug?: Name
  ): Promise<Response<string>> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId.value)
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

    if (scope === 'full-access') {
      const {apiKey, hash} = generateAPIKey();
      const expiresAt = generateExpirationDate(expirationDate);

      await db.insert(apiKeys).values({
        user: user.id,
        expiresAt,
        key: hash,
        scope
      });

      return Response.success(apiKey, 201);
    }

    if (teamSlug === undefined) {
      return Response.error(
        {
          name: 'Internal Error',
          description: 'teamSlug is not defined.'
        },
        500
      );
    }

    const team = await db.query.teams.findFirst({
      where: eq(teams.name, teamSlug.value)
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

    const userExistsInTeam = await db.query.members.findFirst({
      where: and(eq(members.user, user.id), eq(members.team, team.id))
    });
    if (!userExistsInTeam) {
      return Response.error(
        {
          name: 'Unauthorized',
          description: 'You have to set a team you currently belong to.'
        },
        401
      );
    }

    const {apiKey, hash} = generateAPIKey();
    const expiresAt = generateExpirationDate(expirationDate);

    await db.insert(apiKeys).values({
      user: user.id,
      team: team.id,
      key: hash,
      expiresAt,
      scope
    });

    return Response.success(apiKey, 201);
  }

  async verify(apiKey: string): Promise<Response<APIKey>> {
    const key = getAPIKeyHash(apiKey);

    const data = await db.query.apiKeys.findFirst({
      where: eq(apiKeys.key, key)
    });
    if (!data) {
      return Response.error(
        {
          name: 'Unauthorized',
          description: 'The API key is not valid.'
        },
        401
      );
    }

    if (new Date() > data.expiresAt) {
      await db.delete(apiKeys).where(eq(apiKeys.id, data.id));

      return Response.error(
        {
          name: 'Unauthorized',
          description: 'The API key is expired, please get a new one.'
        },
        401
      );
    }

    const response = createAPIKey(data);
    return Response.success(response);
  }

  async delete(
    apiKeyId: Identifier,
    userId: Identifier
  ): Promise<Response<true>> {
    const apiKey = await db.query.apiKeys.findFirst({
      where: and(eq(apiKeys.id, apiKeyId.value), eq(apiKeys.user, userId.value))
    });
    if (!apiKey) {
      return Response.error(
        {
          name: 'Not Found',
          description: 'API key not found.'
        },
        404
      );
    }

    await db
      .delete(apiKeys)
      .where(
        and(eq(apiKeys.id, apiKeyId.value), eq(apiKeys.user, userId.value))
      );

    return Response.success(true);
  }
}
