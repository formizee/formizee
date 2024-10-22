'use client';

import Heading from './_components/heading';
import {Transition} from '@/components';
import Tabs from './_components/tabs';
import NotFound from './not-found';

import {useRouter} from 'next/navigation';
import {api} from '@/trpc/client';

interface Params {
  workspaceSlug: string;
  endpointSlug: string;
}

const EndpointPage = ({params}: {params: Params}) => {
  const {data, error} = api.endpoint.getBySlug.useQuery(params, {
    retry: 0
  });
  const endpoint = data ?? null;
  const router = useRouter();

  if (error?.data?.code === 'UNAUTHORIZED') {
    router.push('/auth/error?error=AccessDenied');
    return;
  }

  if (error?.data?.code === 'NOT_FOUND') {
    return <NotFound />;
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
