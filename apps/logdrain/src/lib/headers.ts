const headers: string[] = [
  'rMeth',
  'rUrl',
  'uAgent',
  'cfRay',
  'cIP',
  'statusCode',
  'contentLength',
  'cfCacheStatus',
  'contentType',
  'responseConnection',
  'requestConnection',
  'cacheControl',
  'acceptRanges',
  'expectCt',
  'expires',
  'lastModified',
  'vary',
  'server',
  'etag',
  'date',
  'transferEncoding'
];

export const options = {
  metadata: headers.map(value => ({field: value}))
};

export const buildMetadataFromHeaders = (
  headers: Headers
): Record<string, string> => {
  const responseMetadata: Record<string, string> = {};
  headers.forEach((value, key) => {
    responseMetadata[key.replace(/-/g, '_')] = value;
  });
  return responseMetadata;
};
