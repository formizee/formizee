'use client';

import type {Color} from '@/lib/colors';
import {generateColumns} from './lib';
import SubmissionsTable from './table';
import {api} from '@/trpc/client';

import {
  LoadingSkeleton,
  SubmissionsEmpty,
  SubmissionsError
} from './components';

interface Props {
  color: Color;
  id: string;
}

export const Table = (props: Props) => {
  const {data, isLoading, error} = api.submission.list.useQuery({
    endpointId: props.id
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <SubmissionsError />;
  }

  if (data.submissions.length < 1) {
    return <SubmissionsEmpty />;
  }

  const columns = generateColumns(data.columns, props.color);

  return (
    <SubmissionsTable
      data={data.submissions}
      color={props.color}
      columns={columns}
      id={props.id}
    />
  );
};
