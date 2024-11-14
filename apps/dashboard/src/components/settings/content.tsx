'use client';

import {type Route, ROUTES, Content} from './pages';
import {SettingsSidebar} from './sidebar';

import {DialogDescription, DialogTitle} from '@formizee/ui';
import {useState} from 'react';
import {SidebarProvider} from '@formizee/ui/sidebar';
import {api} from '@/trpc/client';
import {SettingsBreadcrumb} from './breadcrumb';

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
        <main className="relative flex min-h-[700px] md:max-h-[700px] overflow-auto flex-1">
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
