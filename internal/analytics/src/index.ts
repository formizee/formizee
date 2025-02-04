import {Client, Noop, type Inserter, type Querier} from './client';

import {getBillableApiRequests, getBillableSubmissions} from '@/pipes/billing';
import {insertCacheMetrics, insertDatabaseMetrics} from './pipes/metrics';
import {getLatestAuditLogs, insertAuditLogs} from '@/pipes/audit';
import {getFormizeeStadistics} from '@/pipes/stadistics';
import {insertSDKTelemetry} from '@/pipes/telemetry';
import {insertApiRequest} from '@/pipes/requests';
import {
  getSubmissionsPerDay,
  getSubmissionsPerEndpoint,
  getSubmissionsPerMonth,
  insertSubmissions
} from '@/pipes/submissions';

export type ClickHouseConfig =
  | {
      url?: string;
      insertUrl?: never;
      queryUrl?: never;
    }
  | {
      url?: never;
      insertUrl: string;
      queryUrl: string;
    };

export class Analytics {
  public readonly querier: Querier;
  public readonly inserter: Inserter;

  constructor(config: ClickHouseConfig) {
    if (config.url) {
      const client = new Client({url: config.url});
      this.querier = client;
      this.inserter = client;
    } else if (config.queryUrl && config.insertUrl) {
      this.querier = new Client({url: config.queryUrl});
      this.inserter = new Client({url: config.insertUrl});
    } else {
      this.querier = new Noop();
      this.inserter = new Noop();
    }
  }

  static fromEnv(): Analytics {
    return new Analytics({url: process.env.CLICKHOUSE_URL});
  }

  public get api() {
    return {
      insert: insertApiRequest(this.inserter)
    };
  }

  public get auditLogs() {
    return {
      insert: insertAuditLogs(this.inserter),
      perWeek: getLatestAuditLogs(this.querier)
    };
  }

  public get telemetry() {
    return {
      insert: insertSDKTelemetry(this.inserter)
    };
  }

  public get submissions() {
    return {
      insert: insertSubmissions(this.inserter),
      perDay: getSubmissionsPerDay(this.querier),
      perMonth: getSubmissionsPerMonth(this.querier),
      perEndpoint: getSubmissionsPerEndpoint(this.querier)
    };
  }

  public get billing() {
    return {
      billableApiRequests: getBillableApiRequests(this.querier),
      billableSubmissions: getBillableSubmissions(this.querier)
    };
  }

  public get stadistics() {
    return {
      get: getFormizeeStadistics(this.querier)
    };
  }

  public get metrics() {
    return {
      insertCache: insertCacheMetrics(this.inserter),
      insertDatabase: insertDatabaseMetrics(this.inserter)
    };
  }
}
