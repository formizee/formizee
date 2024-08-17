import Heading from './_components/heading';
import EmptyPage from './(content)/empty';
import {Transition} from '@/components';
import Tabs from './_components/tabs';

import {notFound, redirect} from 'next/navigation';
import {isTRPCClientError} from '@/trpc/utils';
import {api} from '@/trpc/server';

interface Params {
  workspaceSlug: string;
  endpointSlug: string;
}

const getEndpoint = async (params: Params) => {
  try {
    return await api.endpoint.getBySlug.query(params);
  } catch (error) {
    if (isTRPCClientError(error)) {
      if (error.data?.code === 'UNAUTHORIZED') {
        return redirect('/auth/error?error=AccessDenied');
      }

      if (error.data?.code === 'NOT_FOUND') {
        return notFound();
      }
    }
  }
};

const EndpointPage = async ({params}: {params: Params}) => {
  const endpoint = await getEndpoint(params);

  if (!endpoint) {
    return <EmptyPage />;
  }

  return (
    <Transition className="flex flex-col w-full items-center pt-20 justify-start">
      <main className="container flex flex-col">
        <Heading endpoint={endpoint} />
        <Tabs endpoint={endpoint} />
      </main>
    </Transition>
  );
};

export default EndpointPage;
