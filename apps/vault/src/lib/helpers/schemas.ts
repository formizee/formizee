import {HTTPException} from 'hono/http-exception';
import type {DataSchema} from './types';

export const getSchema = async (
  endpointId: string,
  bucket: R2Bucket
): Promise<DataSchema | null> => {
  const schemaObject = await bucket.get(`${endpointId}/schema.json`);
  const schema = await schemaObject?.text();

  if (!schema) {
    return null;
  }

  try {
    const response = JSON.parse(schema);
    return response;
  } catch {
    throw new HTTPException(500, {
      message:
        "The endpoint schema can't be parsed, please contact with support@formizee.com"
    });
  }
};

export const generateSchema = async (
  endpointId: string,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  data: Record<string, any>,
  bucket: R2Bucket
) => {
  const schema: DataSchema = {};

  for (const key in data) {
    // biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
    if (data.hasOwnProperty(key)) {
      schema[key] = typeof data[key];
    }
  }

  const newSchema = JSON.stringify(schema);

  await bucket.put(`${endpointId}/schema.json`, newSchema);

  return schema;
};

export const deleteSchema = async (endpointId: string, bucket: R2Bucket) => {
  const schemaObject = await bucket.get(`${endpointId}/schema.json`);
  const schema = await schemaObject?.text();

  if (!schema) {
    throw new HTTPException(404, {
      message: 'Endpoint schema not found'
    });
  }

  await bucket.delete(`${endpointId}/schema.json`);
};

export const validateData = (
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  data: Record<string, any>,
  schema: DataSchema
): boolean => {
  for (const key in schema) {
    if (!(key in data)) {
      return false;
    }
    // biome-ignore lint/suspicious/useValidTypeof: <explanation>
    if (typeof data[key] !== schema[key]) {
      return false;
    }
  }
  return true;
};
