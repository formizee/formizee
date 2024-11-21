'use client';

import {
  Button,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@formizee/ui';
import {CloseIcon, EyeIcon, FlagIcon} from '@formizee/ui/icons';
import type {RowModel} from '@tanstack/react-table';
import {useEffect, useState} from 'react';
import {DeleteSubmissionGroupDialog} from '../dialogs';

interface Props {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  selectedRows: RowModel<any>;
  resetSelection: (defaultState?: boolean) => void;
  endpointId: string;
}

export const SelectionButton = (props: Props) => {
  const [submissions, setSubmissions] = useState<string[]>([]);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(props.selectedRows.rows.length > 0);

    if (props.selectedRows.rows.length > 0) {
      const data = props.selectedRows.rows.map(row => {
        return row.original.id as string;
      });
      setSubmissions(data);
    }
  }, [props.selectedRows]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className={cn(isVisible ? 'flex' : 'hidden', 'animate-fade-in')}
          >
            {props.selectedRows.rows.length} Rows Selected
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8}>
          <DropdownMenuItem disabled>
            <EyeIcon />
            <span>Mark Read</span>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <FlagIcon />
            <span>Mark Spam</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteVisible(open => !open)}>
            <CloseIcon className="text-red-500" />
            <span>Delete All</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteSubmissionGroupDialog
        resetSelection={props.resetSelection}
        endpointId={props.endpointId}
        setOpen={setDeleteVisible}
        submissions={submissions}
        open={deleteVisible}
      />
    </>
  );
};
