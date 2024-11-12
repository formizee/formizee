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
  const {data, error} = api.endpoint.getBySlug.useQuery(params);
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
    <Transition className="container flex-col w-full items-center pt-10 justify-start">
      <Heading endpoint={endpoint} />
      <Tabs endpoint={endpoint} />
    </Transition>
  );
};

export default EndpointPage;
