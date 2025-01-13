'use client';

import type {Color} from '@/lib/colors';
import {generateColumns} from './lib';
import {api} from '@/trpc/client';
import {Table} from './primitive';
import {useEffect, useState} from 'react';

import {
  ExportButton,
  LoadingSkeleton,
  SelectionButton,
  SubmissionsEmpty,
  SubmissionsError,
  TableFooter
} from './components';

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

interface SubmissionsTableProps {
  color: Color;
  id: string;
}

export function SubmissionsTable(props: SubmissionsTableProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  });

  const {data, isLoading, error} = api.submission.list.useQuery({
    pageIndex: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    endpointId: props.id
  });

  const columns = generateColumns(data?.columns ?? [], props.color);
  const table = useReactTable({
    // Data and State
    columns,
    data: data?.submissions ?? [],
    state: {
      sorting,
      pagination,
      rowSelection,
      columnFilters
    },
    // Actions
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    // Models
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // Pagination
    pageCount: data?.pageCount,
    manualPagination: true
  });

  useEffect(() => {
    if (!isLoading && !error) {
      table.getColumn('formizee_internal_id')?.toggleVisibility();
    }
  }, [isLoading, error]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <SubmissionsError />;
  }

  if (data.submissions.length < 1) {
    return <SubmissionsEmpty />;
  }

  return (
    <Transition className="flex flex-col w-full">
      <TableOptions>
        <TableSearchOptions
          table={table}
          className="max-w-96"
          column={columns[2]?.accessorKey ?? ''}
          placeholder={`Filter Submissions by ${columns[2]?.accessorKey ?? ''}...`}
        />
        <SelectionButton
          endpointId={props.id}
          resetSelection={table.resetRowSelection}
          selectedRows={table.getGroupedSelectedRowModel()}
        />
        <ExportButton />
        <TableColumnOptions table={table} />
      </TableOptions>
      <Table color={props.color} table={table} columns={columns} />
      <TableFooter table={table} />
    </Transition>
  );
}

export default SubmissionsTable;
