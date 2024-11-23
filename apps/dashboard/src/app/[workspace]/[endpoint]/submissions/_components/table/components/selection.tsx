'use client';

import {
  Button,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@formizee/ui';
import {CloseIcon, EyeIcon, FlagIcon, StackIcon} from '@formizee/ui/icons';
import type {RowModel} from '@tanstack/react-table';
import {useEffect, useState} from 'react';
import {DeleteSubmissionGroupDialog} from '../../dialogs';

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
            className={cn(
              isVisible ? 'flex' : 'hidden',
              'animate-fade-in h-[2.2rem]'
            )}
          >
            {props.selectedRows.rows.length} Rows Selected
            <StackIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44" sideOffset={8}>
          <DropdownMenuItem disabled>
            <EyeIcon />
            <span>Mark As Readed</span>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <FlagIcon />
            <span>Mark As Spam</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteVisible(open => !open)}>
            <CloseIcon className="text-red-500" />
            <span>Delete Selected</span>
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
