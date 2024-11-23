import {flexRender, type Header} from '@tanstack/react-table';

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

interface DataTableColumnHeaderProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  header: Header<TData, unknown>;
  color: Color;
}

export function ColumnHeader<TData>({
  color,
  header,
  className
}: DataTableColumnHeaderProps<TData>) {
  if (header.column.columnDef.id === 'formizee_internal_select') {
    return flexRender(header.column.columnDef.header, header.getContext());
  }

  if (header.column.columnDef.id === 'formizee_internal_actions') {
    return;
  }

  const title = header.column.columnDef.header as string;

  if (!header.column.getCanSort()) {
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
              icon={header.column.columnDef.header}
              className={cn(getColor(color, true).fill, 'size-[0.7rem] mr-1')}
            />
            <span>{title}</span>
            {header.column.getIsSorted() === 'desc' ? (
              <ChevronDownIcon className="text-neutral-400 dark:text-neutral-600" />
            ) : header.column.getIsSorted() === 'asc' ? (
              <ChevronUpIcon className="text-neutral-400 dark:text-neutral-600" />
            ) : (
              <ChevronUpDownIcon className="text-neutral-400 dark:text-neutral-600" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => header.column.toggleSorting(false)}>
            <ChevronUpIcon className="text-neutral-400 dark:text-neutral-600" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => header.column.toggleSorting(true)}>
            <ChevronDownIcon className="text-neutral-400 dark:text-neutral-600" />
            Desc
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => header.column.toggleVisibility(false)}
          >
            <EyeSlashIcon className="text-neutral-400 dark:text-neutral-600" />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
