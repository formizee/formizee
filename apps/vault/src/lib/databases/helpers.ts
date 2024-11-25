import {createConnection, type Database} from '@formizee/db-submissions/vault';
import {schema} from '@formizee/db-submissions';
import type {Cache} from '@/lib/cache';

interface Bindings {
  database: Database;
  cache: Cache;
}

const getDatabaseIdFromMappings = async (
  {database, cache}: Bindings,
  endpointId: string
) => {
  const cachedDatabaseId = await cache.getEndpointMapping(endpointId);

  if (cachedDatabaseId !== null) {
    return cachedDatabaseId;
  }

  const mapping = await database.query.mapping.findFirst({
    where: (table, {eq}) => eq(table.endpointId, endpointId)
  });

  if (!mapping) {
    const newMapping = {
      endpointId: endpointId,
      databaseId: 'default'
    };

    await database.insert(schema.mapping).values(newMapping);
    await cache.storeEndpointMapping(newMapping);
    return newMapping.databaseId;
  }

  await cache.storeEndpointMapping(mapping);
  return mapping.databaseId;
};

export const assignOriginDatabase = async (
  {database, cache}: Bindings,
  endpointId: string
): Promise<Database | null> => {
  const databaseId = await getDatabaseIdFromMappings(
    {database, cache},
    endpointId
  );

  if (databaseId === 'default') {
    return Promise.resolve(database);
  }

  const originDatabase = await database.query.database.findFirst({
    where: (table, {eq}) => eq(table.id, databaseId)
  });

  if (!originDatabase) {
    return Promise.resolve(null);
  }

  const response = createConnection({
    databaseUrl: originDatabase.url,
    authToken: originDatabase.token
  });

  return Promise.resolve(response);
};
