import {EndpointTabs, Label} from './_components';
import {Transition} from '@/components';
import {api} from '@/trpc/server';

interface Params {
  workspaceSlug: string;
  endpointSlug: string;
}

const EndpointPage = async ({params}: {params: Params}) => {
  const endpoint = await api.endpoint.getBySlug.query(params);

  if (!endpoint) {
    return <></>;
  }

  return (
    <Transition className="flex flex-col w-full items-center pt-20 justify-start">
      <main className="container flex flex-col">
        <div className="flex flex-row gap-4 mb-4 items-center">
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
