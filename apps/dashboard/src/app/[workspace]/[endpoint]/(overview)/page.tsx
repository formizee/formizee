'use client';

import {Chart, OnboardingCard} from './_components';
import {Transition} from '@/components';
import ErrorPage from '../error';

import {api} from '@/trpc/client';

interface Props {
  params: {
    workspace: string;
    endpoint: string;
  };
}

export default function Overview({params}: Props) {
  const {data, isLoading, error} = api.endpoint.get.useQuery({
    workspaceSlug: params.workspace,
    endpointSlug: params.endpoint
  });

  if (isLoading) {
    return <></>;
  }

  if (error) {
    return <ErrorPage />;
  }

  return (
    <Transition className="flex flex-col w-full items-start">
      <OnboardingCard id={data.id} color={data.color} />
      <Chart id={data.id} color={data.color} />
    </Transition>
  );
}
