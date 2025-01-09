import {NoopTinybird, Tinybird} from '@chronark/zod-bird';
import {metricSchema, type Metric} from './schema';
import {z} from 'zod';

export class Metrics {
  public readonly client: Tinybird | NoopTinybird;

  constructor(opts: {
    tinybirdUrl?: string;
    tinybirdToken?: string;
  }) {
    this.client = opts.tinybirdToken
      ? new Tinybird({token: opts.tinybirdToken, baseUrl: opts.tinybirdUrl})
      : new NoopTinybird();
  }

  public get ingestSdkTelemetry() {
    return this.client.buildIngestEndpoint({
      datasource: 'sdk_telemetry__v1',
      event: z.object({
        runtime: z.string(),
        platform: z.string(),
        versions: z.array(z.string()),
        requestId: z.string(),
        time: z.number()
      })
    });
  }

  public async forceEmit(metric: Metric) {
    const metricType = metric.metric.split('.')[0] ?? '';
    const type = metricType === '' ? '' : `${metricType}__`;

    const publishEvent = this.client.buildIngestEndpoint({
      datasource: `metrics__${type}v1`,
      event: metricSchema
    });

    try {
      await publishEvent(metric);
    } catch (e) {
      const error = e as Error;
      console.error(error.message);
    }
  }

  public emit(metric: Metric) {
    const metricType = metric.metric.split('.')[0] ?? '';
    const type = metricType === '' ? '' : `${metricType}__`;

    const publishEvent = this.client.buildIngestEndpoint({
      datasource: `metrics__${type}v1`,
      event: metricSchema
    });

    try {
      publishEvent(metric);
    } catch (e) {
      const error = e as Error;
      console.error(error.message);
    }
  }
}
