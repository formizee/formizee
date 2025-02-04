import type {schema as mainSchema} from '@formizee/db';
import type {schema} from '@formizee/db/submissions';
import type {Analytics} from '@formizee/analytics';

type Key = Omit<mainSchema.Key, 'hash' | 'createdAt' | 'workspaceId'>;
interface VerifyKeyResult extends Key {
  workspace: mainSchema.Workspace;
}

export class Cache {
  public readonly analytics: Analytics;
  public readonly client: KVNamespace;

  constructor(opts: {client: KVNamespace; analytics: Analytics}) {
    this.analytics = opts.analytics;
    this.client = opts.client;
  }

  // Root Keys
  public async getKeyResponse(
    keyToVerify: string
  ): Promise<VerifyKeyResult | null> {
    const queryStart = performance.now();
    const raw = await this.client.get(`rootKey:${keyToVerify}`);

    this.analytics.metrics.insertCache({
      type: 'read',
      hit: raw !== null,
      key: `rootKey:${keyToVerify}`,
      latency: performance.now() - queryStart
    });

    if (!raw) {
      return Promise.resolve(null);
    }

    try {
      const data = JSON.parse(raw);
      const response: VerifyKeyResult = {
        ...data,
        lastAccess: new Date(data.lastAccess),
        expiresAt: new Date(data.expiresAt)
      };

      return Promise.resolve(response);
    } catch {
      return Promise.resolve(null);
    }
  }

  public async storeKeyResponse(keyToVerify: string, data: VerifyKeyResult) {
    const mutationStart = performance.now();

    await this.client.put(`rootKey:${keyToVerify}`, JSON.stringify(data), {
      expirationTtl: 300
    });

    this.analytics.metrics.insertCache({
      type: 'write',
      key: `rootKey:${keyToVerify}`,
      latency: performance.now() - mutationStart
    });
  }

  public async deleteKeyResponse(keyToVerify: string) {
    const mutationStart = performance.now();

    await this.client.delete(`rootKey:${keyToVerify}`);

    this.analytics.metrics.insertCache({
      type: 'delete',
      key: `rootKey:${keyToVerify}`,
      latency: performance.now() - mutationStart
    });
  }

  // Query Storage

  public async getStorageUsed(endpointId: string): Promise<number | null> {
    const queryStart = performance.now();
    const raw = await this.client.get(`storage:${endpointId}`);

    this.analytics.metrics.insertCache({
      type: 'read',
      hit: raw !== null,
      key: `storage:${endpointId}`,
      latency: performance.now() - queryStart
    });

    if (!raw) {
      return Promise.resolve(null);
    }

    try {
      const response = Number(raw);
      return Promise.resolve(response);
    } catch {
      return Promise.resolve(null);
    }
  }

  public async storeStorageUsed(endpointId: string, value: number) {
    const mutationStart = performance.now();

    await this.client.put(`storage:${endpointId}`, value.toString(), {
      expirationTtl: 300
    });

    this.analytics.metrics.insertCache({
      type: 'write',
      key: `storage:${endpointId}`,
      latency: performance.now() - mutationStart
    });
  }

  public async deleteStorageUsed(endpointId: string) {
    const mutationStart = performance.now();

    await this.client.delete(`storage:${endpointId}`);

    this.analytics.metrics.insertCache({
      type: 'delete',
      key: `storage:${endpointId}`,
      latency: performance.now() - mutationStart
    });
  }

  // Submissions

  public async getSubmission(
    submissionId: string
  ): Promise<schema.Submission | null> {
    const queryStart = performance.now();
    const raw = await this.client.get(`submission:${submissionId}`);

    this.analytics.metrics.insertCache({
      type: 'read',
      hit: raw !== null,
      key: `submission:${submissionId}`,
      latency: performance.now() - queryStart
    });

    if (!raw) {
      return Promise.resolve(null);
    }

    try {
      const data = JSON.parse(raw) as schema.Submission;
      return Promise.resolve(data);
    } catch {
      return Promise.resolve(null);
    }
  }

  public async storeSubmission(data: schema.Submission) {
    const mutationStart = performance.now();

    await this.client.put(`submission:${data.id}`, JSON.stringify(data), {
      expirationTtl: 86400
    });

    this.analytics.metrics.insertCache({
      type: 'write',
      key: `submission:${data.id}`,
      latency: performance.now() - mutationStart
    });
  }

  public async deleteSubmission(submissionId: string) {
    const mutationStart = performance.now();

    await this.client.delete(`submission:${submissionId}`);

    this.analytics.metrics.insertCache({
      type: 'delete',
      key: `submission:${submissionId}`,
      latency: performance.now() - mutationStart
    });
  }

  // List Submissions

  public async getSubmissions(input: {
    endpointId: string;
    page: number;
    pageSize: number;
  }): Promise<{data: schema.Submission[]; totalItems: number} | null> {
    const queryStart = performance.now();

    const raw = await this.client.get(
      `${input.endpointId}:submissions_page_${input.page}_size_${input.pageSize}`
    );

    this.analytics.metrics.insertCache({
      type: 'read',
      hit: raw !== null,
      latency: performance.now() - queryStart,
      key: `${input.endpointId}:submissions_page_${input.page}_size_${input.pageSize}`
    });

    if (!raw) {
      return Promise.resolve(null);
    }

    try {
      const data = JSON.parse(raw) as {
        data: schema.Submission[];
        totalItems: number;
      };
      return Promise.resolve(data);
    } catch {
      return Promise.resolve(null);
    }
  }

  public async storeSubmissions(
    input: {
      endpointId: string;
      page: number;
      pageSize: number;
      totalItems: number;
    },
    data: schema.Submission[]
  ) {
    const mutationStart = performance.now();

    await this.client.put(
      `${input.endpointId}:submissions_page_${input.page}_size_${input.pageSize}`,
      JSON.stringify({
        data,
        totalItems: input.totalItems
      }),
      {
        expirationTtl: 60
      }
    );

    this.analytics.metrics.insertCache({
      type: 'write',
      latency: performance.now() - mutationStart,
      key: `${input.endpointId}:submissions_page_${input.page}_size_${input.pageSize}`
    });
  }

  public async invalidateSubmissions(input: {endpointId: string}) {
    const mutationStart = performance.now();

    const {keys} = await this.client.list({
      prefix: `${input.endpointId}:submissions_page_`
    });

    Promise.all(
      keys.map(async key => {
        await this.client.delete(key.name);
        this.analytics.metrics.insertCache({
          key: key.name,
          type: 'delete',
          latency: performance.now() - mutationStart
        });
      })
    );
  }

  // Endpoint Mappings

  public async getEndpointMapping(endpointId: string) {
    const queryStart = performance.now();

    const data = await this.client.get(`endpoint:${endpointId}`);

    this.analytics.metrics.insertCache({
      type: 'read',
      hit: data !== null,
      key: `endpoint:${endpointId}`,
      latency: performance.now() - queryStart
    });

    return data;
  }

  public async storeEndpointMapping(data: {
    endpointId: string;
    databaseId: string;
  }) {
    const mutationStart = performance.now();

    await this.client.put(`endpoint:${data.endpointId}`, data.databaseId, {
      expirationTtl: 86400
    });

    this.analytics.metrics.insertCache({
      type: 'write',
      key: `endpoint:${data.endpointId}`,
      latency: performance.now() - mutationStart
    });
  }

  public async deleteEndpointMapping(endpointId: string) {
    const mutationStart = performance.now();

    await this.client.delete(`endpoint:${endpointId}`);

    this.analytics.metrics.insertCache({
      key: `endpoint:${endpointId}`,
      type: 'delete',
      latency: performance.now() - mutationStart
    });
  }

  // Databases

  public async getDatabase(
    databaseId: string
  ): Promise<schema.Database | null> {
    const queryStart = performance.now();

    const raw = await this.client.get(`database:${databaseId}`);

    this.analytics.metrics.insertCache({
      type: 'read',
      hit: raw !== null,
      key: `database:${databaseId}`,
      latency: performance.now() - queryStart
    });

    if (!raw) {
      return Promise.resolve(null);
    }

    try {
      const data = JSON.parse(raw) as schema.Database;
      return Promise.resolve(data);
    } catch {
      return Promise.resolve(null);
    }
  }

  public async storeDatabase(input: schema.Database) {
    const mutationStart = performance.now();

    await this.client.put(`database:${input.id}`, JSON.stringify(input), {
      expirationTtl: 86400
    });

    this.analytics.metrics.insertCache({
      type: 'write',
      key: `database:${input.id}`,
      latency: performance.now() - mutationStart
    });
  }

  public async deleteDatabase(databaseId: string) {
    const mutationStart = performance.now();

    await this.client.delete(`database:${databaseId}`);

    this.analytics.metrics.insertCache({
      type: 'delete',
      key: `database:${databaseId}`,
      latency: performance.now() - mutationStart
    });
  }
}
