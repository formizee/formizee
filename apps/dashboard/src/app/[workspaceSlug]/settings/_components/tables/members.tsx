'use client';

import {
  type ColumnDef,
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table';

import {Table, TableActions, TableActionsItem} from '@/components';

import type {schema} from '@/lib/db';
import {
  TableColumnOptions,
  TableOptions,
  TableSearchOptions
} from '@/components';
import {useState} from 'react';
import {CloseIcon, UserGroupIcon} from '@formizee/ui/icons';

export type Member = {
  user: schema.User;
  role: schema.WorkspaceRole;
};

export const columns: ColumnDef<schema.Key>[] = [
  {
    accessorKey: 'user.name',
    header: 'Name'
  },
  {
    accessorKey: 'user.email',
    header: 'Email'
  },
  {
    accessorKey: 'role',
    header: 'Role'
  },
  {
    id: 'actions',
    cell: () => {
      return (
        <TableActions>
          <TableActionsItem disabled>
            <UserGroupIcon />
            Update Role
          </TableActionsItem>
          <TableActionsItem disabled>
            <CloseIcon className="fill-red-500" />
            Remove
          </TableActionsItem>
        </TableActions>
      );
    }
  }
];

interface DataTableProps<TData> {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  columns: any;
  data: TData[];
}

export function MembersTable<TData>({columns, data}: DataTableProps<TData>) {
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
          column="user_email"
          table={table}
          placeholder="Filter by email..."
        />
        <TableColumnOptions table={table} />
      </TableOptions>
      <Table table={table} columns={columns} />
    </div>
  );
}
