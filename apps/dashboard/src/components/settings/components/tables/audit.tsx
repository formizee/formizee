'use client';

import {KeyIcon, UserIcon} from '@formizee/ui/icons';
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
  TableColumnOptions,
  TableSearchOptions,
  TablePagination
} from '@/components';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@formizee/ui';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'actor_name',
    header: 'Actor',
    cell: ({row}) => {
      const data = row.original;

      return (
        <div className="flex flex-row gap-4 items-center">
          {data.actor_type === 'key' ? (
            <KeyIcon className="text-neutral-600 dark:text-neutal-400" />
          ) : (
            <UserIcon className="text-neutral-600 dark:text-neutal-400" />
          )}
          <div className="flex flex-col gap-1 max-w-48">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex justify-start">
                  <span className="font-medium truncate">
                    {String(data.actor_name)}
                  </span>
                </TooltipTrigger>
                <TooltipContent>{String(data.actor_name)}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger className="flex justify-start">
                  <span className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                    {String(data.actor_id)}
                  </span>
                </TooltipTrigger>
                <TooltipContent>{String(data.actor_id)}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: 'event',
    header: 'Event',
    cell: ({row}) => {
      const data = row.original;

      return (
        <div className="flex flex-col gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex justify-start">
                <span className="text-sm font-medium truncate max-w-56">
                  {String(data.description)}
                </span>
              </TooltipTrigger>
              <TooltipContent>{String(data.description)}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger className="flex justify-start">
                <span className="text-xs text-neutral-600 dark:text-neutral-400 max-w-56 truncate">
                  {String(data.event)}
                </span>
              </TooltipTrigger>
              <TooltipContent>{String(data.event)}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    }
  },
  {
    accessorKey: 'time',
    header: 'Time',
    cell: ({row}) => {
      const data = row.getValue('time');
      const date = new Date(0);
      date.setUTCSeconds(Number(data));

      return <span>{date.toLocaleString()}</span>;
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
        <TableSearchOptions
          column="event"
          table={table}
          placeholder="Filter by event type..."
        />
        <TableColumnOptions table={table} />
      </TableOptions>
      <Table table={table} columns={columns} />
      {data.length > 5 ? <TablePagination table={table} /> : <div />}
    </div>
  );
}
