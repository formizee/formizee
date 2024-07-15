import type {APIKeyScope} from 'domain/models/values';
import type {Context, MiddlewareHandler} from 'hono';
import {HTTPException} from 'hono/http-exception';
import {getCookie} from 'hono/cookie';
import {eq} from 'drizzle-orm';
import {apiKeys} from '@drizzle/schemas';
import {db} from '@drizzle/db';
import type {Session} from './types';
import {decrypt} from './jwt';
import {getAPIKeyHash} from './api-keys';

interface AuthOptions {
  /*
   * Disable API Key authentication.
   */
  dashboardOnly?: boolean;
  /*
   * When using API Keys if the api key scope is not full-access it returns a 401.
   */
  needsFullScope?: boolean;
}

interface Authorization {
  userId: string;
  teamId: string | null;
  scope: APIKeyScope;
}

export const authentication = (options?: AuthOptions): MiddlewareHandler => {
  return async function auth(context, next) {
    const isAPIKeyAuthEnabled =
      options?.dashboardOnly === false || options?.dashboardOnly === undefined;
    const isAPIKeyAuthPresent =
      context.req.header('Authorization') !== undefined;
    const isSessionAuthPresent = getCookie(context, 'session');

    if (isAPIKeyAuthEnabled && isAPIKeyAuthPresent) {
      const validApiKey = await validateAPIKey(context);
      if (validApiKey) {
        await next();
        return;
      }
    }

    if (!isAPIKeyAuthEnabled && !isSessionAuthPresent) {
      throwError({
        name: 'Unauthorized',
        description:
          'This enpoint is only accessible from the Formizee Dashboard.'
      });
      return;
    }

    if (isSessionAuthPresent) {
      const validSession = await validateSession(context);
      if (validSession) {
        await next();
        return;
      }
    }
    throwError();
  };
};

export const getAuthentication = (context: Context): Authorization => {
  return context.get('authorization') as Authorization;
};

const throwError = (message?: {name: string; description: string}): void => {
  const defaultMessage = {
    name: 'Unauthorized',
    description: 'Please, login in order to perform this action.'
  };

  const res = new Response(JSON.stringify(message ?? defaultMessage), {
    headers: {'Content-Type': 'application/json'},
    status: 401
  });
  throw new HTTPException(401, {res});
};

const validateSession = async (context: Context): Promise<boolean> => {
  const cookie = getCookie(context, 'session');
  const session = await decrypt(cookie);
  const data = session?.data as Session;

  if (!session || !data.id) {
    throwError();
  }

  context.set('authorization', {
    teamId: null,
    userId: data.id,
    scope: 'full-access'
  });
  return true;
};

const validateAPIKey = async (context: Context, options?: AuthOptions): Promise<boolean> => {
  const authorization = context.req.header('Authorization');
  if (authorization === undefined) {
    throwError();
    return false;
  }
  if (!authorization.includes('Bearer ')) {
    throwError({
      name: 'Unauthorized',
      description: 'Invalid API Key.'
    });
    return false;
  }
  const splittedHeader = authorization.split(' ');

  if (splittedHeader[1] === undefined) {
    throwError({
      name: 'Unauthorized',
      description: 'Invalid API Key.'
    });
    return false;
  }

  const apiKey = getAPIKeyHash(splittedHeader[1]);

  const data = await db.query.apiKeys.findFirst({
    where: eq(apiKeys.key, apiKey)
  });
  if (!data) {
    throwError({
      name: 'Unauthorized',
      description: 'Invalid API Key.'
    });
    return false;
  }

  context.set('authorization', {
    teamId: data.team,
    userId: data.user,
    scope: data.scope
  });

  if(data.scope !== 'full-access' && options?.needsFullScope === true) {
    throwError({
      name: "Unauthorized",
      description: "Your API Key does not allow you to do this action, use one with full access instead."
    })
  }

  return true;
};
