import {
  decryptDEK,
  encryptDEK,
  getLatestMasterKey,
  getMasterKey
} from './helpers';
import type {ConsoleLogger} from '@formizee/logger';
import type {Env} from '@/lib/enviroment';
import type {DEK} from './types';

export class Keys {
  public readonly client: KVNamespace;
  public readonly logger: ConsoleLogger;

  constructor(opts: {client: KVNamespace; logger: ConsoleLogger}) {
    this.client = opts.client;
    this.logger = opts.logger;
  }

  /*
   * This function handles the entire proccess
   * - Generate Keys if not exists
   * - Rotate keys if the master key changes
   * - Encrypt and Decrypt keys
   * */
  public async getEndpointDEK(env: Env, endpointId: string) {
    const existentDek = await this.getDEK(endpointId);

    if (existentDek) {
      // Decrypt existent deck
      const masterKey = await getMasterKey(env, existentDek.metadata.version);
      const {key} = await decryptDEK(existentDek, masterKey);

      // Check if the masterKey is the latest
      const latestMasterKey = await getLatestMasterKey(env);
      if (latestMasterKey.version > masterKey.version) {
        // In case the master key is newer, encrypt with the lastest
        const {dek} = await encryptDEK(latestMasterKey);
        await this.storeDEK(endpointId, dek);
      }

      return Promise.resolve(key);
    }

    // Otherwise, generate a new key with the latest master key
    const latestMasterKey = await getLatestMasterKey(env);
    const {key, dek} = await encryptDEK(latestMasterKey);
    await this.storeDEK(endpointId, dek);

    return Promise.resolve(key);
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
    } catch (error) {
      this.logger.fatal(`DEK for (${endpointId}) can't be parsed`, {error});
      return Promise.reject(error);
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
