import {getConnInfo} from '@hono/node-server/conninfo';
import {lookup} from 'fast-geoip';
import type {Context} from 'hono';

const LOOPBACK = '127.0.0.1';

export const getRequestOriginCountry = async (
  context: Context
): Promise<string> => {
  const connectionInfo = getConnInfo(context);
  const requestAddress = connectionInfo.remote.address;

  if (requestAddress === undefined || requestAddress === LOOPBACK) {
    return 'Unknown';
  }

  const info = await lookup(requestAddress);
  if (info === null) {
    return 'Unknown';
  }

  return info.country;
};
