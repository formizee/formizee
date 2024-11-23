'use client';

import {ExportButton, SelectionButton, TableFooter} from './components';
import {useEffect, useState} from 'react';
import type {Color} from '@/lib/colors';
import {Table} from './primitive';

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type ColumnFiltersState,
  type SortingState,
  getSortedRowModel
} from '@tanstack/react-table';

import {
  Transition,
  TableOptions,
  TableColumnOptions,
  TableSearchOptions
} from '@/components';

interface SubmissionsTableProps<TData> {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  columns: any;
  data: TData[];
  color: Color;
  id: string;
}

export function SubmissionsTable<TData>({
  columns,
  color,
  data,
  id
}: SubmissionsTableProps<TData>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
      columnFilters
    }
  });

  useEffect(() => {
    table.getColumn('formizee_internal_id')?.toggleVisibility(false);
  }, []);

  return (
    <Transition className="flex flex-col w-full">
      <TableOptions>
        <TableSearchOptions
          table={table}
          className="max-w-96"
          column={columns[2].accessorKey}
          placeholder={`Filter Submissions by ${columns[2].accessorKey}...`}
        />
        <SelectionButton
          endpointId={id}
          resetSelection={table.resetRowSelection}
          selectedRows={table.getGroupedSelectedRowModel()}
        />
        <ExportButton />
        <TableColumnOptions table={table} />
      </TableOptions>
      <Table color={color} table={table} columns={columns} />
      <TableFooter table={table} />
    </Transition>
  );
}

export default SubmissionsTable;
