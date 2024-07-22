import type {TaskContext} from 'vitest';
import {db as database, eq, schema} from '@formizee/db';
import {sha256} from '@formizee/hashing';
import {newId} from '@formizee/id';

export type Resources = {
  submission: schema.Submission;
  workspace: schema.Workspace;
  endpoint: schema.Endpoint;
  user: schema.User;
  key: schema.Key;
};

export abstract class Harness {
  public readonly db: typeof database;
  public resources: Resources;

  constructor(t: TaskContext) {
    this.resources = this.createResources();
    this.db = database;

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
    const keyId = newId('test');
    const rootKey = newId('key');
    const hash = await sha256(rootKey);

    const newKey: schema.InsertKey = {
      hash,
      id: keyId,
      name: 'Root Key',
      workspaceId: this.resources.workspace.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    };

    await this.db.insert(schema.key).values(newKey);

    return {
      id: keyId,
      key: rootKey
    };
  }

  public createResources(): Resources {
    const user: schema.User = {
      id: newId('test'),
      name: 'example',
      slug: 'example',
      isVerified: true,
      email: 'example@formizee.com',
      lastAccess: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const workspace: schema.Workspace = {
      id: newId('test'),
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
      slug: 'my-endpoint',
      targetEmails: workspace.availableEmails,
      workspaceId: workspace.id,
      redirectUrl: 'https://formizee.com/thanks-you',
      icon: 'code',
      color: 'gray',
      isEnabled: false,
      emailNotifications: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const submission: schema.Submission = {
      id: newId('test'),
      data: {example: 'formizee'},
      endpointId: endpoint.id,
      createdAt: new Date(),
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
    try {
      await this.db.insert(schema.user).values(this.resources.user);
      await this.db.insert(schema.workspace).values(this.resources.workspace);
      await this.db.insert(schema.endpoint).values(this.resources.endpoint);
      await this.db.insert(schema.submission).values(this.resources.submission);
      await this.db.insert(schema.key).values(this.resources.key);
    } catch {}
  }
}
