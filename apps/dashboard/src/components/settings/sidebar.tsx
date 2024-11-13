import type { Route } from './pages';
import {
  CreditCardIcon,
  KeyIcon,
  LockIcon,
  SettingsIcon,
  UserGroupIcon,
  UserIcon
} from '@formizee/ui/icons';
import {
  Sidebar,
  SidebarGroup,
  SidebarContent,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenu,
  SidebarMenuItem
} from '@formizee/ui/sidebar';

interface Props {
  setCurrentRoute: React.Dispatch<React.SetStateAction<Route>>;
  userName: string;
  userSlug: string;
}

export const SettingsSidebar = (props: Props) => {
  return (
    <Sidebar collapsible="none">
      <SidebarContent className="bg-neutral-100 dark:bg-neutral-900">
        <SidebarHeader>
          <SidebarGroup className="pl-0 pt-0">
            <SidebarGroupContent>
              <SidebarGroupLabel className="text-neutral-600 dark:text-neutral-300">
                Account
              </SidebarGroupLabel>
              <SidebarMenuButton className="h-12">
                <div className="flex flex-row items-center justify-center size-6 rounded-[6px] bg-neutral-600 dark:bg-neutral-400">
                  <span className="fixed text-sm text-neutral-50 dark:text-neutral-950 font-semibold">
                    {props.userName.split('')[0]?.toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-col max-w-44">
                  <span className="text-xs font-regular truncate mr-2">
                    {props.userName}
                  </span>
                  <span className="text-xs text-neutral-600 dark:text-neutral-400 font-regular max-w-[12.5rem] truncate">
                    {props.userSlug}
                  </span>
                </div>
              </SidebarMenuButton>
              <SidebarMenu>
                <Item setCurrentRoute={props.setCurrentRoute} route="account.general">
                  <UserIcon />
                  General
                </Item>
                <Item setCurrentRoute={props.setCurrentRoute} route="account.security">
                  <LockIcon />
                  Security
                </Item>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup className="pl-0">
            <SidebarGroupContent>
              <SidebarGroupLabel className="text-neutral-600 dark:text-neutral-300">
                Workspace
              </SidebarGroupLabel>
              <SidebarMenu>
                <Item setCurrentRoute={props.setCurrentRoute} route="workspace.billing">
                  <CreditCardIcon />
                  Billing
                </Item>
                <Item setCurrentRoute={props.setCurrentRoute} route="workspace.general">
                  <SettingsIcon />
                  General
                </Item>
                <Item setCurrentRoute={props.setCurrentRoute} route="workspace.keys">
                  <KeyIcon />
                  API Keys
                </Item>
                <Item setCurrentRoute={props.setCurrentRoute} route="workspace.members">
                  <UserGroupIcon />
                  Members
                </Item>
                <Item setCurrentRoute={props.setCurrentRoute} route="workspace.audit">
                  <LockIcon />
                  Audit Logs
                </Item>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarHeader>
      </SidebarContent>
    </Sidebar>
  );
};

interface ItemProps {
  setCurrentRoute: React.Dispatch<React.SetStateAction<Route>>;
  children: React.ReactNode;
  route: Route;
}

const Item = (props: ItemProps) => {
  return (
    <SidebarMenuItem className="rounded-md text-neutral-700 dark:text-neutral-300 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800">
      <SidebarMenuButton onClick={() => props.setCurrentRoute(props.route)}>{props.children}</SidebarMenuButton>
    </SidebarMenuItem>
  );
};
