'use client';

import {LoadingSkeleton} from './skeleton';
import {SubmissionsError} from './error';
import {SubmissionsTable} from './table';
import {SubmissionsEmpty} from './empty';
import type {Color} from '@/lib/colors';

import {generateColumns} from './columns';
import {api} from '@/trpc/client';

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
