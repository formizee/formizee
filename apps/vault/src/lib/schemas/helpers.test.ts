import {compareSchema, generateSchema} from './helpers';
import {ConsoleLogger} from '@formizee/logger';
import {schema} from '@formizee/db/submissions';
import {describe, it, expect} from 'vitest';

const logger = new ConsoleLogger({
  ctx: null,
  requestId: '',
  emitLogs: false,
  environment: 'test',
  application: 'vault',
  logtailToken: '<test-token>'
});

describe('compare schema', () => {
  it('Should return valid schemas', () => {
    const schema: schema.Endpoint = {
      id: 'example',
      schema: JSON.stringify({
        name: 'string',
        email: 'string'
      }),
      storageUsed: 0,
      createdAt: new Date()
    };

    const input = {
      data: {
        name: 'example',
        email: 'example@mail.com'
      },
      fileUploads: []
    };

    const response = compareSchema(logger, input, schema);
    expect(response).toStrictEqual(input);
  });

  it('Should return empty values on not valid schemas', () => {
    const schema: schema.Endpoint = {
      id: 'example',
      schema: JSON.stringify({
        name: 'string',
        email: 'string'
      }),
      storageUsed: 0,
      createdAt: new Date()
    };

    const input = {
      data: {
        name: 'example'
      },
      fileUploads: []
    };

    const response = compareSchema(logger, input, schema);

    expect(response).toStrictEqual({
      ...input,
      data: {
        email: '',
        name: 'example'
      }
    });
  });

  it('Should return on valid file schemas', () => {
    const schema: schema.Endpoint = {
      id: 'example',
      schema: JSON.stringify({
        name: 'string',
        email: 'string',
        file: 'file'
      }),
      storageUsed: 0,
      createdAt: new Date()
    };

    const input = {
      data: {
        name: 'example',
        email: 'example@mail.com'
      },
      fileUploads: [
        {
          name: 'example.txt',
          field: 'file'
        }
      ]
    };

    const response = compareSchema(logger, input, schema);
    expect(response).toStrictEqual(input);
  });

  it('Should return empty values on not valid file schemas', () => {
    const schema: schema.Endpoint = {
      id: 'example',
      schema: JSON.stringify({
        name: 'string',
        email: 'string',
        file: 'file'
      }),
      storageUsed: 0,
      createdAt: new Date()
    };

    const input = {
      data: {
        name: 'example'
      },
      fileUploads: []
    };

    const response = compareSchema(logger, input, schema);
    expect(response).toStrictEqual({
      data: {
        name: 'example',
        email: ''
      },
      fileUploads: [
        {
          name: '',
          field: 'file'
        }
      ]
    });
  });
});

describe('generate schema', () => {
  it('should generate data schema', () => {
    const response = generateSchema(
      {
        data: {
          name: 'example',
          email: 'example@mail.com'
        },
        fileUploads: []
      },
      'example'
    );

    expect(response).toMatchObject({
      id: 'example',
      schema: JSON.stringify({
        name: 'string',
        email: 'string'
      })
    });
  });

  it('should generate file schema', () => {
    const response = generateSchema(
      {
        data: {
          name: 'example',
          email: 'example@mail.com'
        },
        fileUploads: [
          {
            name: 'example.txt',
            field: 'file'
          }
        ]
      },
      'example'
    );

    expect(response).toMatchObject({
      id: 'example',
      schema: JSON.stringify({
        name: 'string',
        email: 'string',
        file: 'file'
      })
    });
  });
});
