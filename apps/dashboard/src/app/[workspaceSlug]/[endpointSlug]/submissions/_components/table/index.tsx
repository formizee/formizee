'use client';

import {TableActions, TableActionsItem} from '@/components';
import {SubmissionsError} from './error';
import {LoadingSkeleton} from './skeleton';
import {SubmissionsTable} from './table';
import {api} from '@/trpc/client';
import {ClipboardIcon, CloseIcon} from '@formizee/ui/icons';
import {useState} from 'react';
import {toast} from '@formizee/ui';
import {DeleteSubmissionDialog} from '../dialogs';

interface Props {
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

  const tableActions = [
    {
      id: 'actions',
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      cell: ({row}: any) => {
        const submission = row.original;
        const [deleteOpen, setDeleteOpen] = useState(false);

        const copyID = async () => {
          await navigator.clipboard.writeText(submission.id);
          toast({
            description: 'The submission ID is copied to your clipboard'
          });
        };

        return (
          <>
            <TableActions>
              <TableActionsItem onClick={copyID}>
                <ClipboardIcon />
                Copy ID
              </TableActionsItem>
              <TableActionsItem onClick={() => setDeleteOpen(open => !open)}>
                <CloseIcon className="text-red-400" />
                Delete
              </TableActionsItem>
            </TableActions>
            <DeleteSubmissionDialog
              open={deleteOpen}
              setOpen={setDeleteOpen}
              submissionId={submission.id}
            />
          </>
        );
      }
    }
  ];

  const columns = [...data.columns, ...tableActions];

  return <SubmissionsTable columns={columns} data={data.submissions} />;
};
