export class Cache {
  public readonly client: KVNamespace;

  constructor(opts: {client: KVNamespace}) {
    this.client = opts.client;
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
