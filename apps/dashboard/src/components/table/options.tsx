'use client';

import {ChevronDownIcon, EyeIcon, EyeSlashIcon} from '@formizee/ui/icons';
import type {Table} from '@tanstack/react-table';

import {
  Input,
  Button,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  cn
} from '@formizee/ui';

interface TableColumnOptionsProps<TData> {
  table: Table<TData>;
}

export function TableColumnOptions<TData>({
  table
}: TableColumnOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="hidden lg:flex">
          Columns
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        {table
          .getAllColumns()
          .filter(
            column =>
              typeof column.accessorFn !== 'undefined' && column.getCanHide()
          )
          .map(column => {
            return (
              <DropdownMenuItem
                key={column.id}
                onClick={() => column.toggleVisibility(!column.getIsVisible())}
              >
                {column.getIsVisible() ? (
                  <EyeIcon className="fill-neutral-600 dark:fill-neutral-400" />
                ) : (
                  <EyeSlashIcon className="fill-neutral-400 dark:fill-neutral-600" />
                )}
                <span className="capitalize">
                  {column.columnDef.header?.toString()}
                </span>
              </DropdownMenuItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface TableSearchBarOptionsProps<TData> {
  column: string;
  table: Table<TData>;
  placeholder: string;
}

export function TableSearchOptions<TData>(
  props: TableSearchBarOptionsProps<TData>
) {
  return (
    <Input
      type="search"
      placeholder={props.placeholder ?? 'Search...'}
      value={
        (props.table.getColumn(props.column)?.getFilterValue() as string) ?? ''
      }
      onChange={event =>
        props.table.getColumn(props.column)?.setFilterValue(event.target.value)
      }
    />
  );
}

interface TableOptionsProps {
  children: React.ReactNode;
  className?: string;
}

export const TableOptions = ({children, className}: TableOptionsProps) => {
  return (
    <div
      className={cn(className, 'flex flex-row w-full items-center py-4 gap-4')}
    >
      {children}
    </div>
  );
};
