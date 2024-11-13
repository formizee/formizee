'use client';

import {SettingsIcon} from '@formizee/ui/icons';

import {SidebarMenuButton, SidebarMenuItem} from '@formizee/ui/sidebar';
import {Dialog, DialogContent} from '@formizee/ui';
import {lazy, Suspense, useState} from 'react';
import {DialogLoading} from './loading';

const SettingsDialogContent = lazy(() => import('./dialog'));

interface Props {
  userId: string;
}
export function Settings(props: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => setOpen(open => !open)}
          className="transition-colors text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800"
        >
          <SettingsIcon />
          <span>Settings</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex overflow-hidden p-0 min-h-[700px] min-w-[500px] md:max-h-[700px] max-w-[500px] sm:max-w-[700px] lg:max-w-[900px]">
          <Suspense fallback={<DialogLoading />}>
            <SettingsDialogContent userId={props.userId} />
          </Suspense>
        </DialogContent>
      </Dialog>
    </>
  );
}
