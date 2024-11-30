import type {EdgeWithExecutionContext} from '@logtail/edge/dist/es6/edgeWithExecutionContext';
import type {ExecutionContext} from '@cloudflare/workers-types';
import {Log, type LogSchema} from './schema';
import type {Fields, Logger} from './types';
import {Logtail} from '@logtail/edge';

export class ConsoleLogger implements Logger {
  private readonly environment: LogSchema['environment'];
  private readonly application: LogSchema['application'];
  private readonly client: EdgeWithExecutionContext;
  private readonly defaultFields: Fields;
  private requestId: string;

  constructor(opts: {
    emitLogs: boolean;
    requestId: string;
    logtailToken: string;
    ctx: ExecutionContext;
    defaultFields?: Fields;
    environment: LogSchema['environment'];
    application: LogSchema['application'];
  }) {
    this.requestId = opts.requestId;
    this.environment = opts.environment;
    this.application = opts.application;
    this.defaultFields = opts.defaultFields ?? {};

    const baseLogger = new Logtail(opts.logtailToken, {
      sendLogsToBetterStack: opts.emitLogs,
      sendLogsToConsoleOutput: false,
      ignoreExceptions: true
    });
    this.client = baseLogger.withExecutionContext(opts.ctx);
  }

  private marshal(
    level: 'debug' | 'info' | 'warn' | 'error' | 'fatal',
    message: string,
    fields?: Fields
  ): string {
    return new Log({
      type: 'log',
      environment: this.environment,
      application: this.application,
      requestId: this.requestId,
      time: Date.now(),
      level,
      message,
      context: {...this.defaultFields, ...fields}
    }).toString();
  }

  public debug(message: string, fields?: Fields): void {
    const marshal = this.marshal('debug', message, fields);
    this.client.debug(marshal);
    console.debug(marshal);
  }
  public info(message: string, fields?: Fields): void {
    const marshal = this.marshal('info', message, fields);
    this.client.info(marshal);
    console.info(marshal);
  }
  public warn(message: string, fields?: Fields): void {
    const marshal = this.marshal('warn', message, fields);
    this.client.warn(marshal);
    console.warn(marshal);
  }
  public error(message: string, fields?: Fields): void {
    const marshal = this.marshal('error', message, fields);
    this.client.error(marshal);
    console.error(marshal);
  }
  public fatal(message: string, fields?: Fields): void {
    const marshal = this.marshal('error', message, fields);
    this.client.error(marshal);
    console.error(marshal);
  }

  public setRequestId(requestId: string): void {
    this.requestId = requestId;
  }
}
