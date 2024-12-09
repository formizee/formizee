import type {RequestPostSubmission, ResponseSubmission} from './schema';
import {IntegrationHarness} from '@/lib/testing';
import {describe, it, expect} from 'vitest';
import FormData from 'form-data';

describe('Post submission general behaviours', () => {
  it('Should get 403 on disabled endpoint', async context => {
    const harness = await IntegrationHarness.init(context);
    const endpoint = harness.resources.disabledEndpoint;

    const response = await harness.post<
      RequestPostSubmission,
      ResponseSubmission
    >({
      url: `/v1/f/${endpoint.id}`,
      headers: {'Content-Type': 'application/json'},
      body: {
        name: 'pau',
        email: 'pau@mail.com'
      }
    });

    expect(response.body).toStrictEqual({
      code: 'FORBIDDEN',
      docs: `${harness.docsUrl}/api-references/errors/code/FORBIDDEN`,
      requestId: response.headers['formizee-request-id'],
      message: 'The endpoint is currently not accepting submissions'
    });
    expect(response.status).toBe(403);
  });

  it('Should get 201 on empty submission', async context => {
    const harness = await IntegrationHarness.init(context);
    const endpoint = harness.resources.endpoint;

    const response = await harness.post<
      RequestPostSubmission,
      ResponseSubmission
    >({
      url: `/v1/f/${endpoint.id}`,
      headers: {'Content-Type': 'application/json'},
      body: {}
    });

    expect(response.body).toStrictEqual({
      id: response.body.id,
      endpointId: endpoint.id,
      location: response.body.location,
      isSpam: false,
      isRead: false
    });
    expect(response.status).toBe(201);
  });

  it('Should get 404 on endpoint not found', async context => {
    const harness = await IntegrationHarness.init(context);

    const response = await harness.post<
      RequestPostSubmission,
      ResponseSubmission
    >({
      url: '/v1/f/enp_123456789',
      headers: {'Content-Type': 'application/json'},
      body: {
        name: 'pau',
        email: 'pau@mail.com'
      }
    });

    expect(response.body).toStrictEqual({
      code: 'NOT_FOUND',
      docs: `${harness.docsUrl}/api-references/errors/code/NOT_FOUND`,
      requestId: response.headers['formizee-request-id'],
      message: 'Endpoint not found'
    });
    expect(response.status).toBe(404);
  });
});

describe('Post a submission with application/json', () => {
  it('Should get 201', async context => {
    const harness = await IntegrationHarness.init(context);
    const endpoint = harness.resources.endpoint;
    const {key} = await harness.createKey();

    const postResponse = await harness.post<
      RequestPostSubmission,
      ResponseSubmission
    >({
      url: `/v1/f/${endpoint.id}`,
      headers: {'Content-Type': 'application/json'},
      body: {
        name: 'pau',
        email: 'pau@mail.com'
      }
    });

    const getResponse = await fetch(
      `${harness.apiUrl}/v1/submission/${endpoint.id}/${postResponse.body.id}`,
      {
        headers: {authorization: `Bearer ${key}`}
      }
    );

    const body = (await getResponse.json()) as ResponseSubmission;

    expect(postResponse.status).toBe(201);
    expect(body).toStrictEqual({
      id: postResponse.body.id,
      data: {
        name: 'pau',
        email: 'pau@mail.com'
      },
      endpointId: endpoint.id,
      location: postResponse.body.location,
      isSpam: false,
      isRead: false
    });
  });
});

describe('Post a submission with application/x-www-form-urlencoded', () => {
  it('Should get 200', async context => {
    const harness = await IntegrationHarness.init(context);
    const endpoint = harness.resources.endpoint;
    const {key} = await harness.createKey();

    const formData = new URLSearchParams();
    formData.append('name', 'pau');
    formData.append('email', 'pau@mail.com');

    const postResponse = await fetch(`${harness.apiUrl}/v1/f/${endpoint.id}`, {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: formData.toString(),
      method: 'post'
    });

    const getResponse = await fetch(
      `${harness.apiUrl}/v1/submissions/${endpoint.id}`,
      {
        headers: {authorization: `Bearer ${key}`}
      }
    );

    const body = (await getResponse.json()) as {
      submissions: ResponseSubmission[];
    };

    expect(postResponse.status).toBe(200);
    expect(getResponse.status).toBe(200);
    expect(body).toStrictEqual({
      _metadata: {
        itemsPerPage: 100,
        totalPages: 1,
        page: 1,
        schema: {
          email: 'string',
          name: 'string'
        }
      },
      submissions: [
        {
          id: body.submissions[0]?.id,
          data: {
            email: 'pau@mail.com',
            name: 'pau'
          },
          location: body.submissions[0]?.location,
          endpointId: endpoint.id,
          isSpam: false,
          isRead: false
        }
      ]
    });
  });
});

describe('Post a submission with multipart/form-data', () => {
  it('Should get 200 with data', async context => {
    const harness = await IntegrationHarness.init(context);
    const endpoint = harness.resources.endpoint;

    const formData = new FormData();
    formData.append('name', 'pau');
    formData.append('email', 'pau@mail.com');

    const response = await fetch(`${harness.apiUrl}/v1/f/${endpoint.id}`, {
      headers: formData.getHeaders(),
      body: formData.getBuffer(),
      method: 'post'
    });

    expect(response.status).toBe(200);
  });

  it('Should get 200 with data and a single file', async context => {
    const harness = await IntegrationHarness.init(context);
    const endpoint = harness.resources.endpoint;
    const {key} = await harness.createKey();

    const formData = new FormData();
    formData.append('name', 'pau');
    formData.append('email', 'pau@mail.com');
    formData.append('file', Buffer.from('Example'), 'example.txt');

    const postResponse = await fetch(`${harness.apiUrl}/v1/f/${endpoint.id}`, {
      headers: formData.getHeaders(),
      body: formData.getBuffer(),
      method: 'post'
    });

    const getResponse = await fetch(
      `${harness.apiUrl}/v1/submissions/${endpoint.id}`,
      {
        headers: {authorization: `Bearer ${key}`}
      }
    );

    const body = (await getResponse.json()) as {
      submissions: ResponseSubmission[];
    };

    expect(postResponse.status).toBe(200);
    expect(body).toStrictEqual({
      _metadata: {
        itemsPerPage: 100,
        totalPages: 1,
        page: 1,
        schema: {
          email: 'string',
          name: 'string',
          file: 'file'
        }
      },
      submissions: [
        {
          data: {
            name: 'pau',
            email: 'pau@mail.com',
            file: {
              name: 'example.txt',
              // biome-ignore lint/suspicious/noExplicitAny: <explanation>
              url: (body.submissions[0]?.data as any).file.url
            }
          },
          id: body.submissions[0]?.id,
          endpointId: endpoint.id,
          location: body.submissions[0]?.location,
          isSpam: false,
          isRead: false
        }
      ]
    });
  });

  it('Should get 200 with single file', async context => {
    const harness = await IntegrationHarness.init(context);
    const endpoint = harness.resources.endpoint;
    const {key} = await harness.createKey();

    const formData = new FormData();
    formData.append('file', Buffer.from('Example'), 'example.txt');

    const postResponse = await fetch(`${harness.apiUrl}/v1/f/${endpoint.id}`, {
      headers: formData.getHeaders(),
      body: formData.getBuffer(),
      method: 'post'
    });

    const getResponse = await fetch(
      `${harness.apiUrl}/v1/submissions/${endpoint.id}`,
      {
        headers: {authorization: `Bearer ${key}`}
      }
    );

    const body = (await getResponse.json()) as {
      submissions: ResponseSubmission[];
    };

    expect(postResponse.status).toBe(200);
    expect(body).toStrictEqual({
      _metadata: {
        itemsPerPage: 100,
        totalPages: 1,
        page: 1,
        schema: {
          file: 'file'
        }
      },
      submissions: [
        {
          data: {
            file: {
              name: 'example.txt',
              // biome-ignore lint/suspicious/noExplicitAny: <explanation>
              url: (body.submissions[0]?.data as any).file.url
            }
          },
          id: body.submissions[0]?.id,
          endpointId: endpoint.id,
          location: body.submissions[0]?.location,
          isSpam: false,
          isRead: false
        }
      ]
    });
  });

  it('Should get 200 with multiple files', async context => {
    const harness = await IntegrationHarness.init(context);
    const endpoint = harness.resources.endpoint;
    const {key} = await harness.createKey();

    const formData = new FormData();
    formData.append('name', 'pau');
    formData.append('email', 'pau@mail.com');
    formData.append('file1', Buffer.from('Example'), 'example.txt');
    formData.append(
      'file2',
      Buffer.from('console.log("Example")'),
      'example.js'
    );

    const postResponse = await fetch(`${harness.apiUrl}/v1/f/${endpoint.id}`, {
      headers: formData.getHeaders(),
      body: formData.getBuffer(),
      method: 'post'
    });

    const getResponse = await fetch(
      `${harness.apiUrl}/v1/submissions/${endpoint.id}`,
      {
        headers: {authorization: `Bearer ${key}`}
      }
    );

    const body = (await getResponse.json()) as {
      submissions: ResponseSubmission[];
    };

    expect(postResponse.status).toBe(200);
    expect(body).toStrictEqual({
      _metadata: {
        itemsPerPage: 100,
        totalPages: 1,
        page: 1,
        schema: {
          name: 'string',
          email: 'string',
          file1: 'file',
          file2: 'file'
        }
      },
      submissions: [
        {
          data: {
            name: 'pau',
            email: 'pau@mail.com',
            file1: {
              name: 'example.txt',
              // biome-ignore lint/suspicious/noExplicitAny: <explanation>
              url: (body.submissions[0]?.data as any).file1.url
            },
            file2: {
              name: 'example.js',
              // biome-ignore lint/suspicious/noExplicitAny: <explanation>
              url: (body.submissions[0]?.data as any).file2.url
            }
          },
          id: body.submissions[0]?.id,
          endpointId: endpoint.id,
          location: body.submissions[0]?.location,
          isSpam: false,
          isRead: false
        }
      ]
    });
  });
});
