'use client';

import {type Route, ROUTES, Content} from './pages';
import {SettingsSidebar} from './sidebar';

import {DialogDescription, DialogTitle} from '@formizee/ui';
import {useState} from 'react';
import {SidebarProvider} from '@formizee/ui/sidebar';
import {api} from '@/trpc/client';

export default function SettingsDialogContent(props: {userId: string}) {
  const user = api.user.get.useQuery({id: props.userId}).data;
  const [currentRoute, setCurrentRoute] = useState<Route>(
    ROUTES.accountsGeneral
  );

  if (!user) {
    return;
  }

  return (
    <>
      <DialogTitle className="sr-only">Settings</DialogTitle>
      <DialogDescription className="sr-only">
        Customize your settings here.
      </DialogDescription>
      <SidebarProvider className="items-start">
        <SettingsSidebar
          setCurrentRoute={setCurrentRoute}
          userName={user.name}
          userSlug={user.slug}
        />
        <main className="flex h-[480px] flex-1 flex-col overflow-hidden">
          <Content currentRoute={currentRoute} />
        </main>
      </SidebarProvider>
    </>
  );
}
