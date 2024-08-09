import {handleTrpcServerAction} from '@/trpc/utils';
import {EndpointTabs, Label} from './_components';
import {Transition} from '@/components';
import {api} from '@/trpc/server';

interface Params {
  workspaceSlug: string;
  endpointSlug: string;
}

const EndpointPage = async ({params}: {params: Params}) => {
  const endpoint = await handleTrpcServerAction(
    api.endpoint.getBySlug.query(params)
  );

  return (
    <Transition className="flex flex-col w-full h-full items-center justify-start pt-20">
      <main className="container flex flex-col">
        <div className="flex flex-row gap-2 mb-4 items-center">
          <h1 className="font-bold text-4xl">{endpoint.name}</h1>
          <Label variant={endpoint.isEnabled ? 'active' : 'paused'}>
            {endpoint.isEnabled ? 'Active' : 'Paused'}
          </Label>
        </div>
        <EndpointTabs endpoint={endpoint} />
      </main>
    </Transition>
  );
};

export default EndpointPage;
