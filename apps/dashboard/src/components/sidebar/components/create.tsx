'use client';

import {SidebarGroupAction} from '@formizee/ui/sidebar';
import {CreateEndpointDialog} from './dialog';
import {PlusIcon} from '@formizee/ui/icons';
import {useState} from 'react';

export const Create = (props: {workspaceSlug: string}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col">
      <SidebarGroupAction
        title="New Form"
        onClick={() => setOpen(open => !open)}
        className="font-secondary transition-colors bg-transparent hover:bg-neutral-200 dark:hover:bg-neutral-800"
      >
        <PlusIcon /> <span className="sr-only">New Form</span>
      </SidebarGroupAction>
      <CreateEndpointDialog
        open={open}
        setOpen={setOpen}
        workspaceSlug={props.workspaceSlug}
      />
    </div>
  );
};
