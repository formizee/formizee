'use client';

import {DeleteKeyDialog} from '../dialogs/key';
import type {schema} from '@/lib/db';
import {useState} from 'react';

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type ColumnFiltersState
} from '@tanstack/react-table';
import {
  Table,
  TableOptions,
  TableSearchOptions,
  TableActions,
  TableActionsItem
} from '@/components';
import {ClipboardIcon, CloseIcon} from '@formizee/ui/icons';
import {toast} from '@formizee/ui';

export const columns: ColumnDef<schema.Key>[] = [
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'lastAccess',
    header: 'Last Access',
    cell: ({row}) => {
      const value = row.getValue('lastAccess');
      if (value === 'Never') {
        return <div>Never</div>;
      }
      return <div>{(value as Date).toLocaleString()}</div>;
    }
  },
  {
    accessorKey: 'expiresAt',
    header: 'Expires At',
    cell: ({row}) => {
      const value = row.getValue('expiresAt') as string;
      if (value === 'Never') {
        return <div>Never</div>;
      }

      if (new Date(value) < new Date()) {
        return (
          <span className="text-xs flex items-center bg-red-200/30 dark:bg-red-800/30 w-20 h-6 border-red-400 justify-center text-red-400 border rounded-xl font-medium">
            Expired
          </span>
        );
      }

      return <div>{new Date(value).toLocaleString()}</div>;
    }
  },
  {
    id: 'actions',
    cell: ({row}) => {
      const key = row.original;
      const [deleteOpen, setDeleteOpen] = useState(false);

      const copyKey = async () => {
        await navigator.clipboard.writeText(key.id);
        toast({
          description: 'The API Key is copied to your clipboard'
        });
      };

      return (
        <>
          <TableActions>
            <TableActionsItem onClick={copyKey}>
              <ClipboardIcon />
              Copy Key
            </TableActionsItem>
            <TableActionsItem onClick={() => setDeleteOpen(open => !open)}>
              <CloseIcon className="text-red-400" />
              Delete
            </TableActionsItem>
          </TableActions>
          <DeleteKeyDialog
            keyId={key.id}
            open={deleteOpen}
            setOpen={setDeleteOpen}
          />
        </>
      );
    }
  }
];

interface KeysTableProps<TData> {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  columns: any;
  data: TData[];
}

export function KeysTable<TData>({columns, data}: KeysTableProps<TData>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {columnFilters}
  });

  return (
    <div>
      <TableOptions>
        <TableSearchOptions
          column="name"
          table={table}
          placeholder="Filter API Keys..."
        />
      </TableOptions>
      <Table table={table} columns={columns} />
    </div>
  );
}
