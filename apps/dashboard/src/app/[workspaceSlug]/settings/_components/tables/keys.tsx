'use client';

import {DeleteKeyDialog} from '../dialogs/key';
import {CloseIcon} from '@formizee/ui/icons';
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
  TableActions,
  TableOptions,
  TableActionsItem,
  TableColumnOptions,
  TableSearchOptions
} from '@/components';

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
      const value = row.getValue('expiresAt');
      if (value === 'Never') {
        return <div>Never</div>;
      }
      return <div>{(value as Date).toLocaleString()}</div>;
    }
  },
  {
    id: 'actions',
    cell: ({row}) => {
      const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
      const key = row.original;

      return (
        <>
          <TableActions>
            <TableActionsItem onClick={() => setDeleteDialogVisible(true)}>
              <CloseIcon className="fill-red-500" />
              Delete
            </TableActionsItem>
          </TableActions>
          <DeleteKeyDialog
            isOpen={deleteDialogVisible}
            onOpenChange={() =>
              deleteDialogVisible
                ? setDeleteDialogVisible(false)
                : setDeleteDialogVisible(true)
            }
            keyId={key.id}
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
        <TableColumnOptions table={table} />
      </TableOptions>
      <Table table={table} columns={columns} />
    </div>
  );
}
