import type {Route} from './pages';
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
}

export const SettingsSidebar = (props: Props) => {
  return (
    <Sidebar collapsible="none" className="w-40">
      <SidebarContent className="bg-neutral-100 dark:bg-neutral-900">
        <SidebarHeader>
          <SidebarGroup className="pl-0 pt-0">
            <SidebarGroupContent>
              <SidebarGroupLabel className="text-neutral-600 dark:text-neutral-300">
                Account
              </SidebarGroupLabel>
              <SidebarMenu>
                <Item
                  setCurrentRoute={props.setCurrentRoute}
                  route="account.general"
                >
                  <UserIcon />
                  General
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
                <Item
                  setCurrentRoute={props.setCurrentRoute}
                  route="workspace.general"
                >
                  <SettingsIcon />
                  General
                </Item>
                <Item
                  setCurrentRoute={props.setCurrentRoute}
                  route="workspace.members"
                >
                  <UserGroupIcon />
                  Members
                </Item>
                <Item
                  setCurrentRoute={props.setCurrentRoute}
                  route="workspace.billing"
                >
                  <CreditCardIcon />
                  Billing
                </Item>
                <Item
                  setCurrentRoute={props.setCurrentRoute}
                  route="workspace.keys"
                >
                  <KeyIcon />
                  API Keys
                </Item>
                <Item
                  setCurrentRoute={props.setCurrentRoute}
                  route="workspace.audit"
                >
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
      <SidebarMenuButton onClick={() => props.setCurrentRoute(props.route)}>
        {props.children}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
