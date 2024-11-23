'use client';

import {Transition} from '@/components';
import {Table} from './_components';
import ErrorPage from '../error';

import {api} from '@/trpc/client';

interface Props {
  params: {
    workspace: string;
    endpoint: string;
  };
}

export default function Submissions({params}: Props) {
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
      <Table id={data.id} color={data.color} />
    </Transition>
  );
}
