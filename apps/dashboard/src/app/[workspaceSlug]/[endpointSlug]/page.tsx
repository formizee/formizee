import {notFound, redirect} from 'next/navigation';
import {IconPicker, Transition} from '@/components';
import {EndpointTabs, Label} from './_components';
import {isTRPCClientError} from '@/trpc/utils';
import {api} from '@/trpc/server';
import EmptyPage from './empty';

interface Params {
  workspaceSlug: string;
  endpointSlug: string;
}

const EndpointPage = async ({params}: {params: Params}) => {
  const getEndpoint = async () => {
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

  const endpoint = await getEndpoint();
  if (!endpoint) {
    return <EmptyPage />;
  }

  return (
    <Transition className="flex flex-col w-full items-center pt-20 justify-start">
      <main className="container flex flex-col">
        <div className="flex flex-row gap-4 mb-6 items-center">
          <IconPicker {...params} />
          <h1 className="font-bold text-4xl">{endpoint.name}</h1>
          <Label
            className="mt-1"
            variant={endpoint.isEnabled ? 'active' : 'paused'}
          >
            {endpoint.isEnabled ? 'Active' : 'Paused'}
          </Label>
        </div>
        <EndpointTabs endpoint={endpoint} />
      </main>
    </Transition>
  );
};

export default EndpointPage;
