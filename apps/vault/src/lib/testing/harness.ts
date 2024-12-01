import {type TestingEnviroment, testingEnviroment} from './enviroment';
import type {TaskContext} from 'vitest';
import {newId} from '@formizee/id';

import {
  type Database,
  createConnection,
  schema,
  eq,
  like
} from '@formizee/db/submissions';

interface Resources {
  mapping: schema.EndpointMapping;
  filesEndpoint: schema.Endpoint;
  endpoint: schema.Endpoint;
}

export abstract class Harness {
  public resources: Resources;
  public readonly env: TestingEnviroment;
  public readonly db: Database;

  constructor(t: TaskContext) {
    this.env = testingEnviroment.parse(process.env);
    this.resources = this.createResources();

    this.db = createConnection({
      databaseUrl: this.env.DATABASE_URL,
      authToken: this.env.DATABASE_AUTH_TOKEN
    });

    t.onTestFinished(async () => {
      await this.teardown();
    });
  }

  private async teardown(): Promise<void> {
    const deleteEndpoint = async () => {
      await this.db
        .delete(schema.endpoint)
        .where(eq(schema.endpoint.id, this.resources.endpoint.id));
    };
    const deleteFilesEndpoint = async () => {
      await this.db
        .delete(schema.endpoint)
        .where(eq(schema.endpoint.id, this.resources.filesEndpoint.id));
    };
    const deleteEndpointMapping = async () => {
      await this.db
        .delete(schema.mappings)
        .where(like(schema.mappings.endpointId, 'test_%'));
    };
    for (let i = 1; i <= 5; i++) {
      try {
        await deleteEndpoint();
        await deleteFilesEndpoint();
        await deleteEndpointMapping();
        return;
      } catch (err) {
        if (i === 5) {
          throw err;
        }
        await new Promise(r => setTimeout(r, i * 500));
      }
    }
  }

  protected createResources(): Resources {
    const endpoint: schema.Endpoint = {
      id: newId('test'),
      schema: JSON.stringify({
        name: 'string',
        email: 'string',
        message: 'string'
      }),
      createdAt: new Date()
    };

    const filesEndpoint: schema.Endpoint = {
      id: newId('test'),
      schema: JSON.stringify({
        name: 'string',
        email: 'string',
        file: 'file'
      }),
      createdAt: new Date()
    };

    const mapping: schema.EndpointMapping = {
      endpointId: endpoint.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      databaseId: 'default'
    };

    return {
      filesEndpoint,
      endpoint,
      mapping
    };
  }

  protected async seed(): Promise<void> {
    await this.db.insert(schema.endpoint).values(this.resources.filesEndpoint);
    await this.db.insert(schema.endpoint).values(this.resources.endpoint);
    await this.db.insert(schema.mappings).values(this.resources.mapping);
  }
}
