'use client';

import {DocumentIcon} from '@formizee/ui/icons';
import {CreateEndpointDialog} from './dialog';
import {useState} from 'react';

import {SidebarMenuButton, SidebarMenuItem} from '@formizee/ui/sidebar';

export const New = (props: {workspaceSlug: string}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col">
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => setOpen(open => !open)}
          className="text-neutral-600 dark:text-neutral-400 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800"
        >
          <DocumentIcon />
          <span>New</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <CreateEndpointDialog
        open={open}
        setOpen={setOpen}
        workspaceSlug={props.workspaceSlug}
      />
    </div>
  );
};
