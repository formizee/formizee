import type {Inserter} from '../../client';
import {schema} from './schema';

export function insertApiRequest(ch: Inserter) {
  return ch.insert({
    table: 'metrics.raw_api_requests_v1',
    schema
  });
}
