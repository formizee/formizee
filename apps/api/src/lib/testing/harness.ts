import {type Database, eq, schema, createConnection} from '@formizee/db';
import {integrationTestEnv} from './enviroment';
import type {TaskContext} from 'vitest';
import {Vault} from '@formizee/vault';
import {newKey} from '@formizee/keys';
import {newId} from '@formizee/id';

export type Resources = {
  // Endpoint with 'isEnabled' property disabled
  disabledEndpoint: schema.Endpoint;
  // Endpoint with a schema already defined by 'seedvault'
  endpointWithSchema: schema.Endpoint;
  // Clean endpoint for other things
  endpoint: schema.Endpoint;
  workspace: schema.Workspace;
  user: schema.User;
  key: schema.Key;
};

export type VaultResources = {
  submission: {
    id: string;
    createdAt: Date;
    endpointId: string;
    data: Record<string, string>;
    location: string;
    isRead: boolean;
    isSpam: boolean;
  };
};

export const defaultResources: VaultResources = {
  submission: {
    id: 'sub_123456789',
    endpointId: 'enp_123456789',
    createdAt: new Date(),
    isRead: false,
    isSpam: false,
    location: '',
    data: {}
  }
};

export abstract class Harness {
  public vaultResources: VaultResources = defaultResources;
  public resources: Resources;

  public readonly vault: Vault;
  public readonly db: Database;

  constructor(t: TaskContext) {
    const environment = integrationTestEnv.parse(process.env);

    this.resources = this.createResources();
    this.db = createConnection({
      databaseUrl: environment.DATABASE_URL,
      authToken: environment.DATABASE_AUTH_TOKEN
    });
    this.vault = new Vault({
      url: environment.VAULT_URL,
      token: environment.VAULT_SECRET
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
    const deleteEndpoint = async () => {
      await this.vault.endpoints.delete({
        endpointId: this.resources.disabledEndpoint.id
      });
      await this.vault.endpoints.delete({
        endpointId: this.resources.endpointWithSchema.id
      });
      await this.vault.endpoints.delete({
        endpointId: this.resources.endpoint.id
      });
    };

    for (let i = 1; i <= 5; i++) {
      try {
        await deleteWorkspace();
        await deleteEndpoint();
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
      redirectUrl: 'https://formizee.com',
      icon: 'file',
      color: 'gray',
      isEnabled: true,
      emailNotifications: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const endpointWithSchema: schema.Endpoint = {
      id: newId('test'),
      name: 'My Schema Endpoint',
      slug: 'my-schema-endpoint',
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

    const disabledEndpoint: schema.Endpoint = {
      id: newId('test'),
      name: 'My Disabled Endpoint',
      slug: 'my-disabled-endpoint',
      targetEmails: workspace.availableEmails,
      workspaceId: workspace.id,
      redirectUrl: 'https://formizee.com/thanks-you',
      icon: 'file',
      color: 'red',
      isEnabled: false,
      emailNotifications: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return {
      endpointWithSchema,
      disabledEndpoint,
      workspace,
      endpoint,
      user,
      key
    };
  }

  protected async seed(): Promise<void> {
    await this.db.insert(schema.user).values(this.resources.user);
    await this.db.insert(schema.usersToEmails).values({
      userId: this.resources.user.id,
      email: this.resources.user.email,
      isVerified: true
    });

    await this.db.insert(schema.workspace).values(this.resources.workspace);
    await this.db.insert(schema.key).values(this.resources.key);

    await this.db.insert(schema.endpoint).values(this.resources.endpoint);
    await this.db
      .insert(schema.endpoint)
      .values(this.resources.endpointWithSchema);
    await this.db
      .insert(schema.endpoint)
      .values(this.resources.disabledEndpoint);
  }

  protected async seedVault(): Promise<void> {
    const {data, error} = await this.vault.submissions.post({
      endpointId: this.resources.endpointWithSchema.id,
      data: {name: 'pau', email: 'pau@mail.com'},
      fileUploads: [],
      location: ''
    });

    if (error) {
      console.error('Error seeding the vault');
      throw error;
    }

    const submission = await this.vault.submissions.get({
      endpointId: data.endpointId,
      id: data.id
    });

    if (submission.error) {
      console.error('Error seeding the vault');
      throw error;
    }

    this.vaultResources = {
      submission: submission.data
    };
  }
}
