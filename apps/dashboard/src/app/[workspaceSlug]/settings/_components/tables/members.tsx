'use client';

import {
  type ColumnDef,
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table';

import {Table} from '@/components';

import type {schema} from '@/lib/db';
import {
  TableColumnOptions,
  TableOptions,
  TableSearchOptions
} from '@/components';
import {useState} from 'react';

export type Member = {
  user: schema.User;
  role: schema.WorkspaceRole;
};

export const columns: ColumnDef<Member>[] = [
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
  }
];

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function MembersTable<TData, TValue>({
  columns,
  data
}: DataTableProps<TData, TValue>) {
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
          column="user.email"
          table={table}
          placeholder="Filter by email..."
        />
        <TableColumnOptions table={table} />
      </TableOptions>
      <Table table={table} columns={columns} />
    </div>
  );
}
