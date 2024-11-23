'use client';

import {DeleteEmailDialog} from '../dialogs/emails';
import {CloseIcon} from '@formizee/ui/icons';
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
  Badge,
  Table,
  TableActions,
  TableActionsItem,
  TableOptions,
  TablePagination,
  TableSearchOptions
} from '@/components';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({row}) => {
      const data = row.original;

      return (
        <div className="flex flex-row gap-4">
          <span>{data.email}</span>
          {data.isPrimary ? <Badge>Primary</Badge> : <></>}
        </div>
      );
    }
  },
  {
    accessorKey: 'isVerified',
    header: 'Status',
    cell: ({row}) => {
      const isVerified = row.getValue('isVerified');

      return isVerified ? (
        <Badge variant="blue">Verified</Badge>
      ) : (
        <Badge variant="yellow">Pending</Badge>
      );
    }
  },
  {
    id: 'actions',
    cell: ({row}) => {
      const [deleteOpen, setDeleteOpen] = useState(false);
      const data = row.original;

      return (
        <>
          <TableActions>
            <TableActionsItem
              disabled={data.isPrimary}
              onClick={() => setDeleteOpen(open => !open)}
            >
              <CloseIcon className="text-red-400" />
              Delete
            </TableActionsItem>
          </TableActions>
          <DeleteEmailDialog
            open={deleteOpen}
            setOpen={setDeleteOpen}
            email={data.email}
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

export function EmailsTable<TData>({columns, data}: KeysTableProps<TData>) {
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
        <TableSearchOptions
          column="email"
          table={table}
          placeholder="Filter by email"
        />
      </TableOptions>
      <Table table={table} columns={columns} />
      {data.length > 9 ? <TablePagination table={table} /> : <div />}
    </div>
  );
}
