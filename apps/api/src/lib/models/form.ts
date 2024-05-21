import {Uid} from 'domain/models/values';

export const parseLinkedForms = async (linkedForms: string): Promise<string[]> => {
  try {
    if(linkedForms === '') return Promise.resolve([]);

    let result: string[] = [];

    const data = await JSON.parse(linkedForms);

    data.forEach((form: string) => {
      let item =  new Uid(form);
      result.push(item.value);
    })

    return Promise.resolve(result);
  }
  catch (error) {
    return Promise.reject(error);
  }
}

export const stringifyLinkedForms = async (linkedForms: Uid[]): Promise<string> => {
  try {
    let data: string[] = [];

    linkedForms.forEach(form => {
      data.push(form.value)
    })

    const result = JSON.stringify(data);
    return Promise.resolve(result);
  }
  catch (error) {
    return Promise.reject(error);
  }
}
