import type {DEK} from './types';

export class Keys {
  public readonly client: KVNamespace;

  constructor(opts: {client: KVNamespace}) {
    this.client = opts.client;
  }

  public async getDEK(endpointId: string): Promise<DEK | null> {
    const raw = (await this.client.getWithMetadata(
      `endpoint:${endpointId}`
    )) as {value: string | null; metadata: {version: number}};

    if (!raw.value) {
      return Promise.resolve(null);
    }

    try {
      const data = JSON.parse(raw.value) as {
        iv: string;
        cipherText: string;
      };

      return Promise.resolve({
        data,
        metadata: {
          version: raw.metadata.version
        }
      });
    } catch {
      throw new Error(`DEK for (${endpointId}) can't be parsed`);
    }
  }

  public async storeDEK(endpointId: string, dek: DEK) {
    return await this.client.put(
      `endpoint:${endpointId}`,
      JSON.stringify(dek.data),
      {metadata: {version: dek.metadata.version}}
    );
  }

  public async deleteDEK(endpointId: string) {
    return await this.client.delete(`endpoint:${endpointId}`);
  }
}
