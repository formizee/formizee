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
        'content-type': 'application/json'
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
        'content-type': 'application/json'
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

  it('Should get 403 on bad schema', async context => {
    const harness = await IntegrationHarness.init(context);
    const {id} = harness.resources.endpoint;

    const res = await harness.post<
      RequestPostSubmission,
      ResponsePostSubmission
    >({
      headers: {
        'content-type': 'application/json'
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
      code: 'FORBIDDEN',
      docs: `${harness.env.DOCS_URL}/api-references/errors/code/FORBIDDEN`,
      message: 'The submission does not match the current endpoint schema'
    });
    expect(res.status).toBe(403);
  });

  it('Should get 400 on bad request', async context => {
    const harness = await IntegrationHarness.init(context);

    const res = await harness.post<unknown, ResponsePostSubmission>({
      headers: {
        'content-type': 'application/json'
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
