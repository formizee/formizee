import type {EndpointSchema} from '@formizee/db-submissions/schema';
import type {Database} from '@formizee/db-submissions/vault';
import {schema} from '@formizee/db-submissions';

export const validateSubmission = async (
  database: Database,
  input: {data: string; endpointId: string}
) => {
  try {
    const data = JSON.parse(input.data);

    const endpointSchema = await database.query.endpointSchema.findFirst({
      where: (table, {eq}) => eq(table.id, input.endpointId)
    });

    if (endpointSchema) {
      return compareSchema(data, endpointSchema);
    }

    const newSchema = generateSchema(data, input.endpointId);
    await database.insert(schema.endpointSchema).values(newSchema);
    return true;
  } catch {
    console.error('Unexpected problem validating the endpoint schema');
  }
};

export const generateSchema = (
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  submissionData: Record<string, any>,
  endpointId: string
): EndpointSchema => {
  const schema: Record<string, string> = {};
  for (const [key, value] of Object.entries(submissionData)) {
    const type = typeof value;
    schema[key] = type; // Store the type as a string
  }
  return {
    id: endpointId,
    schema: JSON.stringify(schema),
    createdAt: new Date()
  };
};

export const compareSchema = (
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  submissionData: Record<string, any>,
  endpointSchema: EndpointSchema
): boolean => {
  try {
    const schema = JSON.parse(endpointSchema.schema); // Parse the stringified schema into an object
    for (const [key, expectedType] of Object.entries(schema)) {
      const actualType = typeof submissionData[key];
      if (actualType !== expectedType) {
        return false; // If the type doesn't match, return false
      }
    }
    // Check if there are extra keys in submissionData not in schema
    for (const key of Object.keys(submissionData)) {
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
