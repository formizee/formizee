export type DataSchema = {
  [key: string]: string;
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const generateSchema = (data: Record<string, any>): string => {
  const schema: DataSchema = {};
  for (const key in data) {
    // biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
    if (data.hasOwnProperty(key)) {
      schema[key] = typeof data[key];
    }
  }
  return JSON.stringify(schema);
};

export const validateData = (
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  data: Record<string, any>,
  schema: DataSchema
): boolean => {
  for (const key in schema) {
    if (!(key in data)) {
      return false; // Missing key in data
    }
    // biome-ignore lint/suspicious/useValidTypeof: <explanation>
    if (typeof data[key] !== schema[key]) {
      return false; // Type mismatch (e.g., expected 'string', but found 'number')
    }
  }
  return true; // Data matches the schema
};
