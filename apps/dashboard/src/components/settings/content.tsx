'use client';

import {DialogDescription, DialogTitle} from '@formizee/ui';
import {SettingsBreadcrumb} from './components/breadcrumb';
import {SidebarProvider} from '@formizee/ui/sidebar';
import {SettingsSidebar} from './components/sidebar';
import {type Route, Content} from './pages';

import {api} from '@/trpc/client';

interface Props {
  workspaceSlug: string;
  userId: string;

  setRoute: React.Dispatch<React.SetStateAction<Route>>;
  route: Route;
}

export default function SettingsDialogContent(props: Props) {
  const user = api.user.get.useQuery({id: props.userId}).data;

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
        <SettingsSidebar setCurrentRoute={props.setRoute} />
        <main className="static flex min-h-[700px] md:max-h-[700px] overflow-auto overflow-light-style dark:overflow-dark-style flex-1">
          <SettingsBreadcrumb route={props.route} />
          <Content
            currentRoute={props.route}
            userId={user.id}
            workspaceSlug={props.workspaceSlug}
          />
        </main>
      </SidebarProvider>
    </>
  );
}
