import { Uid } from 'domain/models/values';

export const parseLinkedSubmissions = async (linkedSubmissions: string): Promise<string[]> => {
  try {
    if (linkedSubmissions === '') return Promise.resolve([]);

    let result: string[] = [];

    const data = await JSON.parse(linkedSubmissions);

    data.forEach((submission: string) => {
      let item = new Uid(submission);
      result.push(item.value);
    })

    return Promise.resolve(result);
  }
  catch (error) {
    return Promise.reject(error);
  }
}

export const stringifyLinkedSubmissions = async (linkedSubmissions: Uid[]): Promise<string> => {
  try {
    let data: string[] = [];

    linkedSubmissions.forEach(submission => {
      data.push(submission.value)
    })

    const result = JSON.stringify(data);
    return Promise.resolve(result);
  }
  catch (error) {
    return Promise.reject(error);
  }
}

export const parseFormData = async (data: string): Promise<FormData> => {
  try {
    const formObject = await JSON.parse(data);

    const result = new FormData();

    for (const key in formObject) {
      if (formObject.hasOwnProperty(key)) {
        result.append(key, formObject[key]);
      }
    }

    return Promise.resolve(result);
  } catch (error) {
    return Promise.reject(error);
  }
}

export const stringifyFormData = async (formData: FormData): Promise<string> => {
  try {
    let data: any;
    formData.forEach((value, key) => {
      data[key] = value;
    });
    const result = JSON.stringify(data);
    return Promise.resolve(result);
  } catch (error) {
    return Promise.reject(error);
  }
}
