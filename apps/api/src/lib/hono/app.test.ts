import {describe, it, expect, beforeAll} from 'vitest';
import type {OpenAPIHono} from '@hono/zod-openapi';
import type {HonoEnv} from './types';
import {newApp} from './app';
import {env} from '@/lib/enviroment';

describe('API Configuration', () => {
  let app: OpenAPIHono<HonoEnv>;

  beforeAll(() => {
    app = newApp();
  });

  it('should configure OpenAPI documentation correctly', async () => {
    const res = await app.request('/openapi.json');
    expect(await res.json()).toStrictEqual({
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'Formizee API',
        description: 'The Forms Backend Platform API',
        termsOfService: 'https://www.formizee.com/legal/terms-of-service',
        license: {
          name: 'Apache 2.0',
          url: 'https://github.com/formizee/formizee/blob/main/LICENSE'
        },
        contact: {
          email: 'support@formizee.com'
        }
      },
      servers: [
        {
          url: env.API_URL,
          description: 'Stable Release'
        }
      ],
      tags: [
        {name: 'Health'},
        {name: 'Keys'},
        {name: 'Endpoints'},
        {name: 'Submissions'}
      ],
      components: {
        parameters: {},
        schemas: {},
        securitySchemes: {
          bearerAuth: {
            bearerFormat: 'root key',
            scheme: 'bearer',
            type: 'http'
          }
        }
      },
      paths: {},
      security: [
        {
          apiKey: []
        }
      ]
    });
  });
});
