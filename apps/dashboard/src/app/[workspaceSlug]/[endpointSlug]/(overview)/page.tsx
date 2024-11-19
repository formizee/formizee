'use client';

import {Chart, WelcomeCard} from './_components';
import {Transition} from '@/components';
import ErrorPage from '../error';

import {api} from '@/trpc/client';

interface Props {
  params: {
    workspaceSlug: string;
    endpointSlug: string;
  };
}

export default function Overview({params}: Props) {
  const {data, isLoading, error} = api.endpoint.getBySlug.useQuery(params);

  if (isLoading) {
    return <></>;
  }

  if (error) {
    return <ErrorPage />;
  }

  return (
    <Transition className="flex flex-col w-full items-start">
      <WelcomeCard id={data.id} color={data.color} />
      <Chart id={data.id} color={data.color} />
    </Transition>
  );
}
