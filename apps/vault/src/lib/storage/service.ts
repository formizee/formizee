import {GetObjectCommand, PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';

interface ClientOptions {
  secretAccessKey: string;
  accessKeyId: string;
  endpoint: string;
  bucket: string;
}

interface FileUpload {
  url: string;
  metadata: {
    contentType: string;
    fileName: string;
  };
}

export class Storage {
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor(opts: ClientOptions) {
    this.client = new S3Client({
      region: 'auto',
      endpoint: opts.endpoint,
      credentials: {
        accessKeyId: opts.accessKeyId,
        secretAccessKey: opts.secretAccessKey
      }
    });

    this.bucket = opts.bucket;
  }

  public async putFileUpload(
    file: File,
    keys: {
      id: string;
      submissionId: string;
      endpointId: string;
    }
  ) {
    const fileKey = `${keys.endpointId}/${keys.submissionId}/${keys.id}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: fileKey,
      Body: file.stream(),
      Metadata: {
        contentType: file.type,
        fileName: file.name
      }
    });

    try {
      await this.client.send(command);
      return Promise.resolve({fileKey, error: null});
    } catch (error) {
      console.error(error);
      return Promise.resolve({fileKey: null, error});
    }
  }

  public async getFileUpload(
    fileKey: string,
    expirationTime = 3600
  ): Promise<FileUpload | null> {
    const command = new GetObjectCommand({Bucket: this.bucket, Key: fileKey});
    const object = await this.client.send(command);

    if (object.Body === undefined) {
      return Promise.resolve(null);
    }

    if (
      object.Metadata?.contentType === undefined ||
      object.Metadata?.fileName === undefined
    ) {
      return Promise.resolve(null);
    }

    const url = await getSignedUrl(this.client, command, {
      expiresIn: expirationTime
    });

    const result: FileUpload = {
      url,
      metadata: {
        contentType: object.Metadata.contentType,
        fileName: object.Metadata.fileName
      }
    };

    return Promise.resolve(result);
  }
}
