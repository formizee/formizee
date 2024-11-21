import {TableActions, TableActionsItem} from '@/components';
import {ClipboardIcon, CloseIcon} from '@formizee/ui/icons';
import {DeleteSubmissionDialog} from '../../dialogs';
import {Checkbox, toast} from '@formizee/ui';
import type {Color} from '@/lib/colors';
import {useState} from 'react';

interface Column {
  accessorKey: string;
  header: string;
}

export const generateColumns = (submissionColumns: Column[], color: Color) => {
  const tableSelectColumn = [
    {
      id: 'formizee_internal_select',
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      header: ({table}: any) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          className="mr-4 data-[state=checked]:bg-red-500"
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      cell: ({row}: any) => (
        <Checkbox
          color={color}
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false
    }
  ];

  const tableActionsColumn = [
    {
      id: 'formizee_internal_actions',
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

  return [...tableSelectColumn, ...submissionColumns, ...tableActionsColumn];
};
