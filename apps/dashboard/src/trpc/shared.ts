import type {AppRouter} from './routers';
import {
  type HTTPBatchLinkOptions,
  type HTTPHeaders,
  type TRPCLink,
  httpBatchLink
} from '@trpc/client';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return '';
  }
  const vercel = process.env.VERCEL_URL;

  if (vercel) {
    return `https://${vercel}`;
  }

  return 'http://localhost:3001';
};

export const endingLink = (opts?: {
  headers?: HTTPHeaders | (() => HTTPHeaders);
}) =>
  (runtime => {
    const sharedOpts = {
      headers: opts?.headers
    } satisfies Partial<HTTPBatchLinkOptions>;

    const link = httpBatchLink({
      ...sharedOpts,
      url: `${getBaseUrl()}/api/trpc`
    })(runtime);

    return ctx => {
      const path = ctx.op.path.split('.') as [string, ...string[]];

      const newCtx = {
        ...ctx,
        op: {...ctx.op, path: path.join('.')}
      };
      return link(newCtx);
    };
  }) satisfies TRPCLink<AppRouter>;
