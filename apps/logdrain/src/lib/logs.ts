import {options} from './headers';

export const buildLogMessage = (
  request: Request,
  response: Response
): string => {
  const logDefs: Record<string, string | null | number> = {
    rMeth: request.method,
    rUrl: request.url,
    uAgent: request.headers.get('user-agent'),
    cfRay: request.headers.get('cf-ray'),
    cIP: request.headers.get('cf-connecting-ip'),
    statusCode: response.status,
    contentLength: response.headers.get('content-length'),
    cfCacheStatus: response.headers.get('cf-cache-status'),
    contentType: response.headers.get('content-type'),
    responseConnection: response.headers.get('connection'),
    requestConnection: request.headers.get('connection'),
    cacheControl: response.headers.get('cache-control'),
    acceptRanges: response.headers.get('accept-ranges'),
    expectCt: response.headers.get('expect-ct'),
    expires: response.headers.get('expires'),
    lastModified: response.headers.get('last-modified'),
    vary: response.headers.get('vary'),
    server: response.headers.get('server'),
    etag: response.headers.get('etag'),
    date: response.headers.get('date'),
    transferEncoding: response.headers.get('transfer-encoding')
  };

  const logArray: (string | null | number)[] = [];
  // @ts-ignore
  // biome-ignore lint/complexity/noForEach: <explanation>
  options.metadata.forEach(entry => logArray.push(logDefs[entry.field]));
  return logArray.join(' | ');
};
