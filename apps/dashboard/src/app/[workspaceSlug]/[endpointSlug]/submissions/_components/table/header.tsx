import type {Column} from '@tanstack/react-table';

import {
  cn,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@formizee/ui';
import {
  ChevronDownIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
  EyeSlashIcon
} from '@formizee/ui/icons';
import {HeaderIcon} from './icons';
import {type Color, getColor} from '@/lib/colors';

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  color: Color;
  title: string;
}

export function ColumnHeader<TData, TValue>({
  color,
  column,
  title,
  className
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <HeaderIcon
              icon={column.columnDef.header}
              className={cn(getColor(color, true).fill, 'size-[0.7rem] mr-1')}
            />
            <span>{title}</span>
            {column.getIsSorted() === 'desc' ? (
              <ChevronDownIcon className="text-neutral-400 dark:text-neutral-600" />
            ) : column.getIsSorted() === 'asc' ? (
              <ChevronUpIcon className="text-neutral-400 dark:text-neutral-600" />
            ) : (
              <ChevronUpDownIcon className="text-neutral-400 dark:text-neutral-600" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ChevronUpIcon className="text-neutral-400 dark:text-neutral-600" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ChevronDownIcon className="text-neutral-400 dark:text-neutral-600" />
            Desc
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeSlashIcon className="text-neutral-400 dark:text-neutral-600" />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
