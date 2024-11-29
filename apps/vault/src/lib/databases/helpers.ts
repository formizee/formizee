import {
  schema,
  createConnection,
  type Database
} from '@formizee/db/submissions';
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

  const mapping = await database.query.mappings.findFirst({
    where: (table, {eq}) => eq(table.endpointId, endpointId)
  });

  if (!mapping) {
    const newMapping = {
      endpointId: endpointId,
      databaseId: 'default'
    };

    await Promise.all([
      database.insert(schema.mappings).values(newMapping),
      cache.storeEndpointMapping(newMapping)
    ]);
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

  let originDatabase = await cache.getDatabase(databaseId);

  if (!originDatabase) {
    const response = await database.query.database.findFirst({
      where: (table, {eq}) => eq(table.id, databaseId)
    });

    if (!response) {
      return Promise.resolve(null);
    }

    originDatabase = response;
  }

  const response = createConnection({
    databaseUrl: originDatabase.url,
    authToken: originDatabase.token
  });

  return Promise.resolve(response);
};
