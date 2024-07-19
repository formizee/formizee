import {getConnInfo} from '@hono/node-server/conninfo';
import type {Context} from 'hono';

export const getOriginCountry = async (context: Context): Promise<string> => {
  try {
    const connectionInfo = getConnInfo(context);
    const requestAddress = connectionInfo.remote.address;

    if (requestAddress === undefined) {
      throw new Error();
    }

    const request = await fetch(
      `https://get.geojs.io/v1/ip/country/${requestAddress}.json`
    );
    if (!request.ok) {
      throw new Error();
    }

    const info = await request.json();

    if (info === null || info.name === undefined) {
      throw new Error();
    }

    return info.name;
  } catch {
    return 'Unknown';
  }
};
