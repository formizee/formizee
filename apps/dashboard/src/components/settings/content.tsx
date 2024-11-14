'use client';

import {DialogDescription, DialogTitle} from '@formizee/ui';
import {SettingsBreadcrumb} from './components/breadcrumb';
import {type Route, ROUTES, Content} from './pages';
import {SidebarProvider} from '@formizee/ui/sidebar';
import {SettingsSidebar} from './components/sidebar';

import {useState} from 'react';
import {api} from '@/trpc/client';

interface Props {
  workspaceSlug: string;
  userId: string;
}

export default function SettingsDialogContent(props: Props) {
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
        <SettingsSidebar setCurrentRoute={setCurrentRoute} />
        <main className="static flex min-h-[700px] md:max-h-[700px] overflow-auto overflow-light-style dark:overflow-dark-style flex-1">
          <SettingsBreadcrumb route={currentRoute} />
          <Content
            currentRoute={currentRoute}
            userId={user.id}
            workspaceSlug={props.workspaceSlug}
          />
        </main>
      </SidebarProvider>
    </>
  );
}
