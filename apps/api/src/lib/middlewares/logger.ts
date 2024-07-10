import {logger as honoLogger} from 'hono/logger';

const messages = (message: string): void => {
  const rawData = message.split(' ');

  if (!rawData[3]) {
    console.log(message);
    return;
  }

  const requestType = rawData[3];

  const generateContent = (data: string[]): string => {
    data.splice(0, 4);
    return data.join(' ');
  };

  const generateType = (type: string): string => {
    if (type === 'GET') return '\x1b[32mGET\x1b[0m';
    if (type === 'POST') return '\x1b[34mPOST\x1b[0m';
    if (type === 'PUT') return '\x1b[33mPUT\x1b[0m';
    if (type === 'PATCH') return '\x1b[35mPATCH\x1b[0m';
    if (type === 'DELETE') return '\x1b[31mDELETE\x1b[0m';
    return type;
  };

  const content = generateContent(rawData);
  if (message.includes('->')) {
    console.log(` ${generateType(requestType)} -> ${content}\n`);
  } else {
    console.log(` ${generateType(requestType)} <- ${content}`);
  }
};

export const logger = honoLogger(messages);
