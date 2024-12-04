import {fileTypeFromBlob} from 'file-type';
import {AwsClient} from 'aws4fetch';

interface ClientOptions {
  secretAccessKey: string;
  accessKeyId: string;
  endpoint: string;
  bucket: string;
}

export class BaseStorage {
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

  async generateGetPresignedUrl(
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

  async generatePutPresignedUrl(
    fileKey: string,
    expirationTime = 300
  ): Promise<string> {
    const signedUrl = await this.client.sign(
      new Request(
        `${this.endpoint}/${this.bucket}/${fileKey}?X-Amz-Expires=${expirationTime}`,
        {method: 'PUT'}
      ),
      {
        aws: {signQuery: true}
      }
    );

    return Promise.resolve(signedUrl.url.toString());
  }

  async getObject(fileKey: string) {
    try {
      const command = new Request(
        `${this.endpoint}/${this.bucket}/${fileKey}`,
        {
          method: 'GET'
        }
      );

      const response = await this.client.fetch(command);
      return Promise.resolve(response);
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }

  async putObject(
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

    const fileType = await fileTypeFromBlob(file);
    const contentType = await this.parseDangerousFiles(fileType?.mime);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const fileBuffer = new Uint8Array(arrayBuffer);

      const command = new Request(
        `${this.endpoint}/${this.bucket}/${fileKey}`,
        {
          method: 'put',
          headers: {
            'Content-Type': contentType,
            'x-amz-meta-file-name': file.name,
            'X-Content-Type-Options': 'nosniff',
            'Content-Disposition': `attachment; filename="${file.name}"`,
            'Content-Security-Policy':
              "default-src 'none'; script-src 'none'; object-src 'none'"
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

  async deleteObject(fileKey: string) {
    try {
      const command = new Request(
        `${this.endpoint}/${this.bucket}/${fileKey}`,
        {
          method: 'DELETE'
        }
      );

      await this.client.fetch(command);
    } catch (error) {
      console.error(error);
    }
  }

  private async parseDangerousFiles(mime: string | undefined) {
    const dangerousFileTypes = [
      // Executable Files
      'application/x-msdownload',
      'application/x-httpd-php',
      'application/javascript',
      'application/xhtml+xml',
      'application/x-sh',
      'text/x-python',
      'text/x-perl',
      'text/html',

      // Media Files
      'application/json',
      'application/pdf',
      'image/svg+xml',
      'image/x-icon',
      'image/gif',

      // Office Specific
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (mime !== undefined && !dangerousFileTypes.includes(mime)) {
      return mime;
    }

    return 'application/octet-stream';
  }
}
