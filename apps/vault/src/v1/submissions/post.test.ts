import type {RequestPostSubmission, ResponsePostSubmission} from './schema';
import {IntegrationHarness} from '@/lib/testing';
import {describe, it, expect} from 'vitest';

describe('Create a submission', () => {
  it('Should get 201 on post data', async context => {
    const harness = await IntegrationHarness.init(context);
    const {id} = harness.resources.endpoint;

    const res = await harness.post<
      RequestPostSubmission,
      ResponsePostSubmission
    >({
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${harness.env.VAULT_SECRET}`
      },
      url: '/v1/submission',
      body: {
        endpointId: id,
        data: {
          name: 'pau',
          email: 'pau@mail.com',
          message: 'This is an example'
        },
        fileUploads: [],
        location: '0.0.0.0'
      }
    });

    expect(res.body).toMatchObject({
      endpointId: id,
      isRead: false,
      isSpam: false,
      location: '0.0.0.0',
      pendingUploads: []
    });
    expect(res.status).toBe(201);
  });

  it('Should get 201 on post files', async context => {
    const harness = await IntegrationHarness.init(context);
    const {id} = harness.resources.filesEndpoint;

    const res = await harness.post<
      RequestPostSubmission,
      ResponsePostSubmission
    >({
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${harness.env.VAULT_SECRET}`
      },
      url: '/v1/submission',
      body: {
        endpointId: id,
        data: {
          name: 'pau',
          email: 'pau@mail.com'
        },
        fileUploads: [{field: 'file', name: 'test.txt'}],
        location: '0.0.0.0'
      }
    });

    expect(res.body).toMatchObject({
      endpointId: id,
      isRead: false,
      isSpam: false,
      location: '0.0.0.0',
      pendingUploads: [
        {
          field: 'file'
        }
      ]
    });
    expect(res.status).toBe(201);
  });

  it('Should get 201 on bad schema', async context => {
    const harness = await IntegrationHarness.init(context);
    const {id} = harness.resources.endpoint;

    const res = await harness.post<
      RequestPostSubmission,
      ResponsePostSubmission
    >({
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${harness.env.VAULT_SECRET}`
      },
      url: '/v1/submission',
      body: {
        endpointId: id,
        data: {
          badSchema: 'pau'
        },
        fileUploads: [],
        location: '0.0.0.0'
      }
    });

    expect(res.body).toStrictEqual({
      pendingUploads: [],
      id: res.body.id,
      endpointId: res.body.endpointId,
      location: res.body.location,
      createdAt: res.body.createdAt,
      isRead: res.body.isRead,
      isSpam: res.body.isSpam
    });
    expect(res.status).toBe(201);
  });

  it('Should get 201 on bad files schema', async context => {
    const harness = await IntegrationHarness.init(context);
    const {id} = harness.resources.filesEndpoint;

    const res = await harness.post<
      RequestPostSubmission,
      ResponsePostSubmission
    >({
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${harness.env.VAULT_SECRET}`
      },
      url: '/v1/submission',
      body: {
        endpointId: id,
        data: {
          badSchema: 'pau'
        },
        fileUploads: [
          {
            name: 'example.txt',
            field: 'filed'
          }
        ],
        location: '0.0.0.0'
      }
    });

    expect(res.body).toStrictEqual({
      pendingUploads: [
        {
          field: 'file',
          url: null
        }
      ],
      id: res.body.id,
      endpointId: res.body.endpointId,
      location: res.body.location,
      createdAt: res.body.createdAt,
      isRead: res.body.isRead,
      isSpam: res.body.isSpam
    });
    expect(res.status).toBe(201);
  });

  it('Should get 400 on bad request', async context => {
    const harness = await IntegrationHarness.init(context);

    const res = await harness.post<unknown, ResponsePostSubmission>({
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${harness.env.VAULT_SECRET}`
      },
      url: '/v1/submission',
      body: {}
    });

    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({
      code: 'BAD_REQUEST',
      docs: `${harness.env.DOCS_URL}/api-references/errors/code/BAD_REQUEST`
    });
  });
});
