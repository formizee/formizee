import type {Database} from '@formizee/db-submissions/vault';
import {schema} from '@formizee/db-submissions';
import {AwsClient} from 'aws4fetch';
import {newId} from '@formizee/id';

interface ClientOptions {
  secretAccessKey: string;
  accessKeyId: string;
  endpoint: string;
  bucket: string;
}

export class Storage {
  private readonly client: AwsClient;
  private readonly endpoint: string;
  private readonly bucket: string;

  constructor(opts: ClientOptions) {
    this.client = new AwsClient({
      service: 's3',
      region: 'us-east-1',
      accessKeyId: opts.accessKeyId,
      secretAccessKey: opts.secretAccessKey
    });

    this.endpoint = opts.endpoint;
    this.bucket = opts.bucket;
  }

  public async handleFileUploads(
    database: Database,
    fileUploads: File | File[],
    endpointId: string,
    submissionId: string
  ) {
    const files = Array.isArray(fileUploads) ? fileUploads : [fileUploads];

    if (files.length > 0) {
      for (const file of files) {
        const fileId = newId('fileUpload');

        const {fileKey} = await this.putFileUpload(file, {
          id: fileId,
          submissionId,
          endpointId
        });

        if (fileKey) {
          await database.insert(schema.fileUpload).values({
            id: fileId,
            name: file.name,
            fileKey: fileKey,
            submissionId,
            endpointId
          });
        }
      }
    }
  }

  private async putFileUpload(
    file: File,
    keys: {
      id: string;
      submissionId: string;
      endpointId: string;
    }
  ) {
    const extension =
      file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length) ||
      file.name;
    const fileKey = `${keys.endpointId}/${keys.submissionId}/${keys.id}.${extension}`;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const fileBuffer = new Uint8Array(arrayBuffer);

      const command = new Request(
        `${this.endpoint}/${this.bucket}/${fileKey}`,
        {
          method: 'put',
          headers: {
            'Content-Type': file.type,
            'x-amz-meta-file-name': file.name
          },
          body: fileBuffer
        }
      );

      await this.client.fetch(command);
      return Promise.resolve({fileKey, error: null});
    } catch (e) {
      return Promise.resolve({fileKey: null, e});
    }
  }

  public async getFileUpload(
    fileKey: string,
    expirationTime = 3600
  ): Promise<string> {
    const signedUrl = await this.client.sign(
      new Request(
        `${this.endpoint}/${this.bucket}/${fileKey}?X-Amz-Expires=${expirationTime}`
      ),
      {
        aws: {signQuery: true}
      }
    );

    return Promise.resolve(signedUrl.url.toString());
  }
}
