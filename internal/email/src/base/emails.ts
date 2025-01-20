import {render} from '@react-email/components';
import {createBaseClient} from './helpers';
import type {ClientBaseConfig} from './types';
import type {AwsClient} from 'aws4fetch';

interface SendRequest {
  react?: React.ReactElement;
  to: string | string[];
  plainText?: string;
  replyTo: string;
  subject: string;
  html?: string;
  from: string;
}

export class EmailsService {
  private readonly client: AwsClient;
  private readonly region: string;

  constructor(options: ClientBaseConfig) {
    this.client = createBaseClient(options);
    this.region = options.region ?? 'eu-west-3';
  }

  public async send(
    request: SendRequest
  ): Promise<{error: null} | {error: Error}> {
    const ToAddresses =
      typeof request.to === 'string' ? [request.to] : request.to;

    const html = request.react
      ? render(request.react, {pretty: true})
      : request.html;
    const plainText = request.react
      ? render(request.react, {plainText: true})
      : request.plainText;

    const res = await this.client.fetch(
      `https://email.${this.region}.amazonaws.com/v2/email/outbound-emails`,
      {
        headers: {'Content-Type': 'application/json'},
        method: 'POST',
        body: JSON.stringify({
          Destination: {ToAddresses},
          FromEmailAddress: request.from,
          Content: {
            Simple: {
              Subject: {Data: request.subject},
              Body: {
                Text: {
                  Data: plainText
                },
                Html: {
                  Data: html
                }
              }
            }
          }
        })
      }
    );

    if (!res.ok) {
      return Promise.resolve({
        error: new Error(`Email error: ${JSON.stringify(await res.json())}`)
      });
    }

    return Promise.resolve({error: null});
  }
}
