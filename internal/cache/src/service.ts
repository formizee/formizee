import type {schema as mainSchema} from '@formizee/db';
import type {schema} from '@formizee/db/submissions';
import type {Metrics} from '@formizee/metrics';

type Key = Omit<mainSchema.Key, 'hash' | 'createdAt' | 'workspaceId'>;
interface VerifyKeyResult extends Key {
  workspace: mainSchema.Workspace;
}

export class Cache {
  public readonly client: KVNamespace;
  public readonly metrics: Metrics;

  constructor(opts: {client: KVNamespace; metrics: Metrics}) {
    this.client = opts.client;
    this.metrics = opts.metrics;
  }

  // Root Keys
  public async getKeyResponse(
    keyToVerify: string
  ): Promise<VerifyKeyResult | null> {
    const queryStart = performance.now();
    const raw = await this.client.get(`rootKey:${keyToVerify}`);

    this.metrics.emit({
      metric: 'vault.cache.read',
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

    this.metrics.emit({
      metric: 'vault.cache.write',
      key: `rootKey:${keyToVerify}`,
      latency: performance.now() - mutationStart
    });
  }

  public async deleteKeyResponse(keyToVerify: string) {
    const mutationStart = performance.now();

    await this.client.delete(`rootKey:${keyToVerify}`);

    this.metrics.emit({
      metric: 'vault.cache.delete',
      key: `rootKey:${keyToVerify}`,
      latency: performance.now() - mutationStart
    });
  }

  // Submissions

  public async getSubmission(
    submissionId: string
  ): Promise<schema.Submission | null> {
    const queryStart = performance.now();
    const raw = await this.client.get(`submission:${submissionId}`);

    this.metrics.emit({
      metric: 'vault.cache.read',
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

    this.metrics.emit({
      metric: 'vault.cache.write',
      key: `submission:${data.id}`,
      latency: performance.now() - mutationStart
    });
  }

  public async deleteSubmission(submissionId: string) {
    const mutationStart = performance.now();

    await this.client.delete(`submission:${submissionId}`);

    this.metrics.emit({
      metric: 'vault.cache.delete',
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

    this.metrics.emit({
      metric: 'vault.cache.read',
      hit: raw !== null,
      key: `${input.endpointId}:submissions_page_${input.page}_size_${input.pageSize}`,
      latency: performance.now() - queryStart
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
        expirationTtl: 3600
      }
    );

    this.metrics.emit({
      metric: 'vault.cache.write',
      key: `${input.endpointId}:submissions_page_${input.page}_size_${input.pageSize}`,
      latency: performance.now() - mutationStart
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
        this.metrics.emit({
          key: key.name,
          metric: 'vault.cache.delete',
          latency: performance.now() - mutationStart
        });
      })
    );
  }

  // Endpoint Mappings

  public async getEndpointMapping(endpointId: string) {
    const queryStart = performance.now();

    const data = await this.client.get(`endpoint:${endpointId}`);

    this.metrics.emit({
      metric: 'vault.cache.read',
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

    this.metrics.emit({
      metric: 'vault.cache.write',
      key: `endpoint:${data.endpointId}`,
      latency: performance.now() - mutationStart
    });
  }

  public async deleteEndpointMapping(endpointId: string) {
    const mutationStart = performance.now();

    await this.client.delete(`endpoint:${endpointId}`);

    this.metrics.emit({
      key: `endpoint:${endpointId}`,
      metric: 'vault.cache.delete',
      latency: performance.now() - mutationStart
    });
  }

  // Databases

  public async getDatabase(
    databaseId: string
  ): Promise<schema.Database | null> {
    const queryStart = performance.now();

    const raw = await this.client.get(`database:${databaseId}`);

    this.metrics.emit({
      metric: 'vault.cache.read',
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

    this.metrics.emit({
      metric: 'vault.cache.write',
      key: `database:${input.id}`,
      latency: performance.now() - mutationStart
    });
  }

  public async deleteDatabase(databaseId: string) {
    const mutationStart = performance.now();

    await this.client.delete(`database:${databaseId}`);

    this.metrics.emit({
      key: `database:${databaseId}`,
      metric: 'vault.cache.delete',
      latency: performance.now() - mutationStart
    });
  }
}
