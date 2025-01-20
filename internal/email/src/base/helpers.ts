import {AwsClient} from 'aws4fetch';
import type {ClientBaseConfig} from './types';

export const createBaseClient = (options: ClientBaseConfig): AwsClient => {
  return new AwsClient({
    secretAccessKey: options.secretAccesKey,
    region: options.region ?? 'eu-west-3',
    accessKeyId: options.accessKey,
    service: 'ses'
  });
};
