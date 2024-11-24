import {type Database, createConnection} from '@formizee/db/api';
import {eq, schema} from '@formizee/db';
import {databaseEnv} from './enviroment';
import type {TaskContext} from 'vitest';
import {newKey} from '@formizee/keys';
import {newId} from '@formizee/id';

export type Resources = {
  submission: schema.Submission;
  workspace: schema.Workspace;
  endpoint: schema.Endpoint;
  user: schema.User;
  key: schema.Key;
};

export abstract class Harness {
  public readonly db: Database;
  public resources: Resources;

  constructor(t: TaskContext) {
    const {DATABASE_URL} = databaseEnv.parse(process.env);

    this.resources = this.createResources();
    this.db = createConnection({
      databaseUrl: DATABASE_URL
    });

    t.onTestFinished(async () => {
      await this.teardown();
    });
  }

  private async teardown(): Promise<void> {
    const deleteWorkspace = async () => {
      await this.db
        .delete(schema.workspace)
        .where(eq(schema.workspace.id, this.resources.workspace.id));
    };
    const deleteUser = async () => {
      await this.db
        .delete(schema.user)
        .where(eq(schema.user.id, this.resources.user.id));
    };
    for (let i = 1; i <= 5; i++) {
      try {
        await deleteWorkspace();
        await deleteUser();
        return;
      } catch (err) {
        if (i === 5) {
          throw err;
        }
        await new Promise(r => setTimeout(r, i * 500));
      }
    }
  }

  public async createKey() {
    const id = newId('test');
    const {key, hash} = await newKey();

    const data: schema.InsertKey = {
      id,
      hash,
      name: 'Root Key',
      workspaceId: this.resources.workspace.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    };

    await this.db.insert(schema.key).values(data);

    return {id, key};
  }

  public createResources(): Resources {
    const user: schema.User = {
      id: newId('test'),
      name: 'user',
      slug: 'user',
      image: '',
      emailVerified: new Date(),
      email: 'user@formizee.com',
      lastAccess: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const workspace: schema.Workspace = {
      id: newId('test'),
      name: 'Formizee',
      slug: 'formizee',
      stripeId: 'stripeId1',
      subscriptionId: 'subscriptionId',
      availableEmails: [user.email],
      plan: 'pro',
      endsAt: null,
      paidUntil: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const key: schema.Key = {
      name: 'Example Key',
      id: newId('test'),
      createdAt: new Date(),
      lastAccess: new Date(),
      workspaceId: workspace.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      hash: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b'
    };

    const endpoint: schema.Endpoint = {
      id: newId('test'),
      name: 'My Endpoint',
      slug: 'my-endpoint',
      targetEmails: workspace.availableEmails,
      workspaceId: workspace.id,
      redirectUrl: 'https://formizee.com/thanks-you',
      icon: 'file',
      color: 'gray',
      isEnabled: true,
      emailNotifications: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const submission: schema.Submission = {
      id: newId('test'),
      data: {},
      endpointId: endpoint.id,
      createdAt: new Date(),
      location: 'Spain',
      isSpam: false,
      isRead: false
    };

    return {
      submission,
      workspace,
      endpoint,
      user,
      key
    };
  }

  protected async seed(): Promise<void> {
    await this.db.insert(schema.user).values(this.resources.user);
    await this.db.insert(schema.workspace).values(this.resources.workspace);
    await this.db.insert(schema.endpoint).values(this.resources.endpoint);
    await this.db.insert(schema.submission).values(this.resources.submission);
    await this.db.insert(schema.key).values(this.resources.key);
  }
}
