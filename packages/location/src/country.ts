import {getConnInfo} from '@hono/node-server/conninfo';
import {lookup} from 'geoip-lite';
import type {Context} from 'hono';

const LOOPBACK = '127.0.0.1';

export const getOriginCountry = (context: Context): string => {
  try {
    const connectionInfo = getConnInfo(context);
    const requestAddress = connectionInfo.remote.address;

    if (requestAddress === undefined || requestAddress === LOOPBACK) {
      return 'Unknown';
    }

    const info = lookup(requestAddress);
    if (info === null) {
      return 'Unknown';
    }

    return info.country;
  } catch {
    return 'Unknown';
  }
};
