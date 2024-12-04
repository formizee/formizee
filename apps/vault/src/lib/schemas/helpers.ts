import {schema, type Database} from '@formizee/db/submissions';
import type {ConsoleLogger} from '@formizee/logger';

export const validateSubmission = async (
  originDatabase: Database,
  logger: ConsoleLogger,
  input: {
    data: Record<string, string>;
    fileUploads: {field: string; name: string}[];
    endpointId: string;
  }
) => {
  try {
    const endpointSchema = await originDatabase.query.endpoint.findFirst({
      where: (table, {eq}) => eq(table.id, input.endpointId)
    });

    if (endpointSchema) {
      return compareSchema(logger, input, endpointSchema);
    }

    const newSchema = generateSchema(input, input.endpointId);
    await originDatabase.insert(schema.endpoint).values(newSchema);
    return input;
  } catch (error) {
    logger.error('Unexpected problem validating the endpoint schema', {error});
    return null;
  }
};

export const generateSchema = (
  input: {
    data: Record<string, string>;
    fileUploads: {field: string; name: string}[];
  },
  endpointId: string
): schema.Endpoint => {
  const schema: Record<string, string> = {};

  for (const [key, value] of Object.entries(input.data)) {
    const type = typeof value;
    schema[key] = type; // Store the type as a string
  }

  for (const file of input.fileUploads) {
    schema[file.field] = 'file';
  }

  return {
    id: endpointId,
    storageUsed: 0,
    schema: JSON.stringify(schema),
    createdAt: new Date()
  };
};

export const compareSchema = (
  logger: ConsoleLogger,
  input: {
    data: Record<string, string>;
    fileUploads: {field: string; name: string}[];
  },
  endpointSchema: schema.Endpoint
): {
  data: Record<string, string>;
  fileUploads: {field: string; name: string}[];
} | null => {
  try {
    const data = {
      ...input.data,
      ...Object.fromEntries(
        input.fileUploads.map(file => [file.field, file.name])
      )
    };

    const schema = JSON.parse(endpointSchema.schema) as Record<
      string,
      'string' | 'file'
    >;

    const validatedData: Record<string, string> = {};
    const validatedFileUploads: {field: string; name: string}[] = [];

    for (const [key, expectedType] of Object.entries(schema)) {
      if (expectedType === 'string') {
        const actualValue = data[key];
        const actualType = typeof actualValue;

        if (actualType === expectedType) {
          validatedData[key] = actualValue ?? '';
        } else {
          validatedData[key] = '';
        }
      } else {
        let keyAssigned = false;
        for (const file of input.fileUploads) {
          if (key === file.field) {
            validatedFileUploads.push(file);
            keyAssigned = true;
          }
        }
        if (!keyAssigned) {
          validatedFileUploads.push({
            name: '',
            field: key
          });
        }
      }
    }

    return {
      data: validatedData,
      fileUploads: validatedFileUploads
    };
  } catch (error) {
    logger.error('Error parsing schema:', {error});
    return null;
  }
};
