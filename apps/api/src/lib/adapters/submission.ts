export const parseFormData = async (data: any): Promise<FormData> => {
  try {
    const result = new FormData();

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        result.append(key, data[key]);
      }
    }

    return Promise.resolve(result);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const stringifyFormData = async (
  formData: FormData
): Promise<string> => {
  try {
    let data: any;
    formData.forEach((value, key) => {
      data[key] = value;
    });
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
};
