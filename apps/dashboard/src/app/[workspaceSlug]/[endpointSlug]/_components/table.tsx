'use client';

import {useState} from 'react';

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type ColumnFiltersState
} from '@tanstack/react-table';
import {
  Table,
  TableOptions,
  TableColumnOptions,
  TableSearchOptions,
  TablePagination
} from '@/components';

interface SubmissionsTableProps<TData> {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  columns: any;
  data: TData[];
}

export function SubmissionsTable<TData>({
  columns,
  data
}: SubmissionsTableProps<TData>) {
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
          column={columns[1].accessorKey}
          table={table}
          placeholder={`Filter Submissions by ${columns[1].accessorKey}...`}
        />
        <TableColumnOptions table={table} />
      </TableOptions>
      <Table table={table} columns={columns} />
      {data.length > 20 ? <TablePagination table={table} /> : <div />}
    </div>
  );
}
