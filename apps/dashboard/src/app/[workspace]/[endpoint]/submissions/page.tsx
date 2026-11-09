'use client';
import { use } from "react";

import {SubmissionsTable} from './_components';
import {Transition} from '@/components';
import ErrorPage from '../error';

import {api} from '@/trpc/client';

interface Props {
  params: Promise<{
    workspace: string;
    endpoint: string;
  }>;
}

export default function Submissions(props: Props) {
  const params = use(props.params);
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
      <SubmissionsTable id={data.id} color={data.color} />
    </Transition>
  );
}
