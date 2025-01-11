import {notFound, redirect} from 'next/navigation';
import {isTRPCClientError} from './errors';

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
