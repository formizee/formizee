import {buildMetadataFromHeaders} from './lib/headers';
import {buildLogMessage} from './lib/logs';
import {sleep} from './lib/utils';
import {makeid} from './lib/id';

// Batching
const BATCH_INTERVAL_MS = 500;
const MAX_REQUESTS_PER_BATCH = 100;
const WORKER_ID = makeid(6);

let workerTimestamp: string | undefined;

let batchTimeoutReached = true;
let logEventsBatch: Record<string, unknown>[] = [];

// Backoff
const BACKOFF_INTERVAL = 10000;
let backoff = 0;

async function addToBatch(
  body: Record<string, unknown>,
  _connectingIp: string | null,
  env: Env
): Promise<boolean> {
  logEventsBatch.push(body);

  if (logEventsBatch.length >= MAX_REQUESTS_PER_BATCH) {
    await postBatch(env);
  }

  return true;
}

async function handleRequest(request: Request, env: Env): Promise<Response> {
  const requestMetadata = buildMetadataFromHeaders(request.headers);

  const t1 = Date.now();
  const response = await fetch(request);
  const originTimeMs = Date.now() - t1;

  const rUrl = request.url;
  const rMeth = request.method;
  const rCf = {...request.cf} || {};
  delete rCf.tlsClientAuth;
  delete rCf.tlsExportedAuthenticator;

  const responseMetadata = buildMetadataFromHeaders(response.headers);

  const eventBody = {
    message: buildLogMessage(request, response),
    dt: new Date().toISOString(),
    metadata: {
      response: {
        headers: responseMetadata,
        origin_time: originTimeMs,
        status_code: response.status
      },
      request: {
        url: rUrl,
        method: rMeth,
        headers: requestMetadata,
        cf: rCf
      },
      cloudflare_worker: {
        version: '1.0.0',
        worker_id: WORKER_ID,
        worker_started: workerTimestamp
      }
    }
  };

  await addToBatch(eventBody, requestMetadata['cf_connecting_ip'] || null, env);

  return response;
}

const fetchAndSetBackOff = async (
  lfRequest: RequestInit,
  env: Env
): Promise<boolean> => {
  if (backoff <= Date.now()) {
    const resp = await fetch('https://in.logs.betterstack.com/', lfRequest);
    if (resp.status === 403 || resp.status === 429) {
      backoff = Date.now() + BACKOFF_INTERVAL;
    }
  }

  await scheduleBatch(env);

  return true;
};

const postBatch = async (env: Env): Promise<void> => {
  const batchInFlight = [...logEventsBatch];
  logEventsBatch = [];
  // @ts-ignore
  const rHost = batchInFlight[0]?.metadata?.request?.headers?.host || 'unknown';
  const body = JSON.stringify(batchInFlight);
  const request: RequestInit = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.LOGTAIL_TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': `Cloudflare Worker via ${rHost}`
    },
    body
  };
  await fetchAndSetBackOff(request, env);
};

const scheduleBatch = async (env: Env): Promise<boolean> => {
  if (batchTimeoutReached) {
    batchTimeoutReached = false;
    await sleep(BATCH_INTERVAL_MS);
    if (logEventsBatch.length > 0) {
      await postBatch(env);
    }
    batchTimeoutReached = true;
  }
  return true;
};

interface Env {
  LOGTAIL_TOKEN: string;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    ctx.waitUntil(scheduleBatch(env));

    if (!workerTimestamp) {
      workerTimestamp = new Date().toISOString();
    }

    return await handleRequest(request, env);
  }
};
