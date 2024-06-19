import type {StorageService as Service} from 'domain/services';
import {Response} from 'domain/models';
import {S3Client} from '@aws-sdk/client-s3';
import {Upload} from '@aws-sdk/lib-storage';

export class StorageService implements Service {
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor() {
    this.client = new S3Client({
      credentials: {
        accessKeyId: process.env.STORAGE_ACCESS_KEY ?? '(null)',
        secretAccessKey: process.env.STORAGE_SECRET_KEY ?? '(null)'
      },
      //endpoint: process.env.STORAGE_URL,
      region: 'eu-west-3'
    });
    this.bucket = process.env.STORAGE_BUCKET ?? '(null)';
  }

  load(_path: string): Promise<Response<File>> {
    throw new Error('Not Implemented');
  }

  async save(path: string, file: File): Promise<Response<URL>> {
    const fileSizeLimit = 5 * 1024 * 1024;

    if (file.size >= fileSizeLimit) {
      return Response.error('Maximum file size is 5 MB.', 413);
    }

    const streamBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(streamBuffer);

    const upload = new Upload({
      client: this.client,
      params: {
        Bucket: this.bucket,
        Key: path,
        Body: buffer,
        Metadata: {
          name: file.name,
          lastModified: new Date(file.lastModified).toString()
        }
      }
    });

    const response = await upload.done();
    if (!response.Key || !response.Location) {
      return Response.error("File can't be uploaded.", 500);
    }

    return Response.success(new URL(response.Location), 201);
  }

  delete(_path: string): Promise<Response<true>> {
    throw new Error('Not Implemented');
  }
}
