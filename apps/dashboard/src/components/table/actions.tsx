'use client';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@formizee/ui';
import {EllipsisIcon} from '@formizee/ui/icons';

interface TableActionsProps {
  children: React.ReactNode;
}

export const TableActions = ({children}: TableActionsProps) => {
  return (
    <div className="flex flex-row w-full justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="group size-6 p-0">
            <span className="sr-only">Open menu</span>
            <EllipsisIcon className="rotate-90 fill-neutral-600 dark:fill-neutral-400 group-hover:fill-neutral-950 dark:group-hover:fill-neutral-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">{children}</DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

interface TableActionsItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export const TableActionsItem = (props: TableActionsItemProps) => {
  return (
    <DropdownMenuItem
      onClick={props.onClick}
      disabled={props.disabled ?? false}
    >
      {props.children}
    </DropdownMenuItem>
  );
};
