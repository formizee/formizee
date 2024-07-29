import {getConnInfo} from 'hono/cloudflare-workers';
import type {Context} from 'hono';

export type Location = 'Unknown' | string;

export async function getOriginCountry(context: Context): Promise<Location> {
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

    // biome-ignore lint/suspicious/noExplicitAny:
    const info = (await request.json()) as any;

    if (info === null || info.name === undefined) {
      throw new Error();
    }

    return info.name;
  } catch {
    return 'Unknown';
  }
}
