import {ColumnHeader} from './components';
import type {Color} from '@/lib/colors';

import {
  cn,
  Table as Component,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@formizee/ui';

import {
  type ColumnDef,
  type Table as DataTable,
  flexRender
} from '@tanstack/react-table';

interface DataTableProps<TData> {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  columns: ColumnDef<TData, any>[];
  table: DataTable<TData>;
  className?: string;
  color: Color;
}

export function Table<TData>({
  columns,
  table,
  className,
  color
}: DataTableProps<TData>) {
  return (
    <div
      className={cn(
        'rounded-md border border-neutral-200 dark:border-neutral-800',
        className
      )}
    >
      <Component>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <TableHead
                    className="border-b border-neutral-200 dark:border-neutral-800 p-2"
                    key={header.id}
                  >
                    {header.isPlaceholder ? null : (
                      <ColumnHeader header={header} color={color} />
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => {
              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell
                      key={cell.id}
                      className="border-t border-neutral-200 dark:border-neutral-800 py-3 truncate"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No data found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Component>
    </div>
  );
}
