import {schema, type Database} from '@formizee/db/submissions';

export const validateSubmission = async (
  originDatabase: Database,
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
      return compareSchema(input, endpointSchema);
    }

    const newSchema = generateSchema(input, input.endpointId);
    await originDatabase.insert(schema.endpoint).values(newSchema);
    return true;
  } catch {
    console.error('Unexpected problem validating the endpoint schema');
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
    schema[file.field] = 'string';
  }

  return {
    id: endpointId,
    schema: JSON.stringify(schema),
    createdAt: new Date()
  };
};

export const compareSchema = (
  input: {
    data: Record<string, string>;
    fileUploads: {field: string; name: string}[];
  },
  endpointSchema: schema.Endpoint
): boolean => {
  try {
    const data = {
      ...input.data, // Spread the data from the first object
      ...Object.fromEntries(
        input.fileUploads.map(file => [file.field, file.name])
      ) // Convert fileUploads array to an object
    };

    const schema = JSON.parse(endpointSchema.schema); // Parse the stringified schema into an object
    for (const [key, expectedType] of Object.entries(schema)) {
      const actualType = typeof data[key];
      if (actualType !== expectedType) {
        return false; // If the type doesn't match, return false
      }
    }
    // Check if there are extra keys in submissionData not in schema
    for (const key of Object.keys(data)) {
      if (!(key in schema)) {
        return false; // If there's an unexpected key, return false
      }
    }
    return true; // If all checks pass, the submissionData is valid
  } catch (e) {
    console.error('Error parsing schema:', e);
    return false; // Return false if schema parsing fails
  }
};
