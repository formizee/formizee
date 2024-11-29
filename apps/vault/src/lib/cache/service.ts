import type {schema} from '@formizee/db/submissions';

export class Cache {
  public readonly client: KVNamespace;

  constructor(opts: {client: KVNamespace}) {
    this.client = opts.client;
  }

  // Submissions

  public async getSubmission(
    submissionId: string
  ): Promise<schema.Submission | null> {
    const raw = await this.client.get(`submission:${submissionId}`);
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
    return await this.client.put(
      `submission:${data.id}`,
      JSON.stringify(data),
      {
        expirationTtl: 86400
      }
    );
  }

  public async deleteSubmission(submissionId: string) {
    return await this.client.delete(`submission:${submissionId}`);
  }

  // List Submissions

  public async getSubmissions(input: {
    endpointId: string;
    page: number;
    pageSize: number;
  }): Promise<{data: schema.Submission[]; totalItems: number} | null> {
    const raw = await this.client.get(
      `${input.endpointId}:submissions_page_${input.page}_size_${input.pageSize}`
    );
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
    return await this.client.put(
      `${input.endpointId}:submissions_page_${input.page}_size_${input.pageSize}`,
      JSON.stringify({
        data,
        totalItems: input.totalItems
      }),
      {
        expirationTtl: 3600
      }
    );
  }

  public async invalidateSubmissions(input: {endpointId: string}) {
    const {keys} = await this.client.list({
      prefix: `${input.endpointId}:submissions_page_`
    });

    Promise.all(
      keys.map(async key => {
        await this.client.delete(key.name);
      })
    );
  }

  // Endpoint Mappings

  public async getEndpointMapping(endpointId: string) {
    return await this.client.get(`endpoint:${endpointId}`);
  }

  public async storeEndpointMapping(data: {
    endpointId: string;
    databaseId: string;
  }) {
    return await this.client.put(
      `endpoint:${data.endpointId}`,
      data.databaseId,
      {
        expirationTtl: 86400
      }
    );
  }

  public async deleteEndpointMapping(endpointId: string) {
    return await this.client.delete(`endpoint:${endpointId}`);
  }

  // Databases

  public async getDatabase(
    databaseId: string
  ): Promise<schema.Database | null> {
    const raw = await this.client.get(`database:${databaseId}`);
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
    return await this.client.put(
      `database:${input.id}`,
      JSON.stringify(input),
      {
        expirationTtl: 86400
      }
    );
  }

  public async deleteDatabase(databaseId: string) {
    return await this.client.delete(`database:${databaseId}`);
  }
}
