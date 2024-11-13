'use client';

import {CloseIcon, DocumentIcon, ReloadIcon} from '@formizee/ui/icons';
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
import {Button} from '@formizee/ui';

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
      const key = row.original;
      return (
        <TableActions>
          <TableActionsItem onClick={() => console.log(key)}>
            <ReloadIcon />
            Rename
          </TableActionsItem>
          <TableActionsItem onClick={() => console.log(key)}>
            <CloseIcon className="fill-red-500" />
            Delete
          </TableActionsItem>
        </TableActions>
      );
    }
  }
];

interface KeysTableProps<TData> {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  columns: any;
  data: TData[];
}

export function AuditTable<TData>({columns, data}: KeysTableProps<TData>) {
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
      <TableOptions className="justify-end">
        <TableSearchOptions column={columns} table={table} placeholder={'Search logs...'} />
        <Button variant="outline">
          Export <DocumentIcon />
        </Button>
        <TableColumnOptions table={table} />
      </TableOptions>
      <Table table={table} columns={columns} />
    </div>
  );
}
