'use client';

import {DialogLoading} from './loading';
import {lazy, Suspense} from 'react';
import {useSettings} from '.';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogDescription
} from '@formizee/ui';

const Content = lazy(() => import('./content'));

export default function SettingsDialog() {
  const {open, setOpen, route, setRoute, workspaceSlug, userId} = useSettings();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex overflow-hidden border-2 p-0 min-h-[700px] min-w-[500px] md:max-h-[700px] max-w-[500px] sm:max-w-[700px] lg:max-w-[900px]">
        <DialogTitle className="hidden">Settings</DialogTitle>
        <DialogDescription className="hidden">
          Here you can change the Formizee Settings
        </DialogDescription>
        <Suspense fallback={<DialogLoading />}>
          <Content
            route={route}
            setRoute={setRoute}
            workspaceSlug={workspaceSlug}
            userId={userId}
          />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}
