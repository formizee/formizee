import type {schema} from '@formizee/db/submissions';

export class Cache {
  public readonly client: KVNamespace;

  constructor(opts: {client: KVNamespace}) {
    this.client = opts.client;
  }

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
}
