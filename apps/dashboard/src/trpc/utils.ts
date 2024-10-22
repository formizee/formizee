import {notFound, redirect} from 'next/navigation';
import {TRPCClientError} from '@trpc/client';
import type {AppRouter} from './routers';

export function parseTrpcError(error: {message: string}): string {
  const messages = JSON.parse(error.message) as Array<{message: string}>;
  return (
    messages.at(0)?.message ??
    'Unknown error, please contact support@formizee.com'
  );
}

export function isTRPCClientError(
  cause: unknown
): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError;
}

export async function handleTrpcServerAction<T>(promise: Promise<T>) {
  try {
    return await promise;
  } catch (error) {
    if (isTRPCClientError(error)) {
      if (error.data?.code === 'UNAUTHORIZED') {
        return redirect('/auth/error?error=AccessDenied');
      }

      if (error.data?.code === 'NOT_FOUND') {
        return notFound();
      }
    }

    throw error;
  }
}
