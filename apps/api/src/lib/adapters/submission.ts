export const objectToFormData = <T extends Record<string, unknown>>(
  obj: T,
  formData?: FormData,
  parentKey?: string
): FormData => {
  const resultFormData = formData ?? new FormData();

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      const currentKey = parentKey ? `${parentKey}[${key}]` : key;

      if (value instanceof File) {
        resultFormData.append(currentKey, value, value.name);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          const nestedKey = `${currentKey}[${index.toString()}]`;
          objectToFormData(
            item as Record<string, unknown>,
            resultFormData,
            nestedKey
          );
        });
      } else if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
      ) {
        objectToFormData(
          value as Record<string, unknown>,
          resultFormData,
          currentKey
        );
      } else {
        resultFormData.append(currentKey, String(value));
      }
    }
  }

  return resultFormData;
};

export const formDataToObject = async (formData: FormData): Promise<object> => {
  try {
    const result = Object.fromEntries(formData);
    return Promise.resolve(result);
  } catch (error) {
    return Promise.reject(error);
  }
};
