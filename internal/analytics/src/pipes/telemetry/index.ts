import type {Inserter} from '@/client';
import {schema} from './schema';

export function insertSDKTelemetry(ch: Inserter) {
  return ch.insert({
    table: 'telemetry.raw_sdks_v1',
    schema
  });
}
