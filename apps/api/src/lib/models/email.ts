import { Email } from "domain/models/values";

export const parseLinkedEmails = async (linkedEmails: string): Promise<string[]> => {
  try {
    if(linkedEmails === '') return Promise.resolve([]);

    let result: string[] = [];

    const data = await JSON.parse(linkedEmails);

    data.forEach((email: string) => {
      let item =  new Email(email);
      result.push(item.value);
    })

    return Promise.resolve(result);
  }
  catch (error) {
    return Promise.reject(error);
  }
}

export const stringifyLinkedEmails = async (linkedEmails: Email[]): Promise<string> => {
  try {
    let data: string[] = [];

    linkedEmails.forEach(email => {
      data.push(email.value)
    })

    const result = JSON.stringify(data);
    return Promise.resolve(result);
  }
  catch (error) {
    return Promise.reject(error);
  }
}
