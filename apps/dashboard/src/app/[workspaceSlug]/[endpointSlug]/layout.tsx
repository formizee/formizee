'use client';

import {usePathname} from 'next/navigation';
import {Heading, Tabs} from './_components';
import {Transition} from '@/components';
import {Skeleton} from '@formizee/ui';
import {api} from '@/trpc/client';
import ErrorPage from './error';

interface Params {
  workspaceSlug: string;
  endpointSlug: string;
}

interface Props {
  children: React.ReactNode;
  params: Params;
}

export default function PageLayout({params, children}: Props) {
  const {data, isLoading, error} = api.endpoint.getBySlug.useQuery(params);
  const currentPath = usePathname();

  if (isLoading) {
    return (
      <Transition className="container flex flex-col gap-4 items-start mt-16 h-full">
        <div className="flex flex-row gap-4 items-center">
          <Skeleton className="size-12" />
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-20 rounded-xl" />
        </div>
        <div className="flex flex-row gap-2 mt-8">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-8 w-28" />
        </div>
      </Transition>
    );
  }

  if (error) {
    console.error(error);
    return <ErrorPage />;
  }
  return (
    <Transition className="container flex flex-col gap-4 items-start mt-10 h-full">
      <Heading endpoint={data} />
      <Tabs
        currentPath={currentPath}
        endpointSlug={params.endpointSlug}
        workspaceSlug={params.workspaceSlug}
      />
      <main className="flex w-full h-full">{children}</main>
    </Transition>
  );
}
