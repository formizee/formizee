import {BookIcon} from '@formizee/ui/icons';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@formizee/ui/sidebar';
import {EndpointsContent} from './endpoints';
import {Logo} from '@formizee/ui';
import {Account} from './account';
import {auth} from '@/lib/auth';
import {redirect} from 'next/navigation';
import {SearchPalette} from '../command-palette';
import {FeedbackButton} from './feedback';
import {Settings} from '../settings';

interface AppSidebarProps {
  workspaceSlug: string;
}

export const AppSidebar = async (props: AppSidebarProps) => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  return (
    <Sidebar className="dark:border-neutral-800">
      <SidebarHeader>
        <div className="flex flex-row items-center h-14 pl-2 gap-5">
          <Logo />
          <span className="px-3 border select-none border-neutral-300 dark:border-neutral-700 rounded-xl text-sm tex-neutral-700 dark:text-neutral-100">
            Beta
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SearchPalette workspaceSlug={props.workspaceSlug} />
              <Settings userId={session.user.id} workspaceSlug={props.workspaceSlug} />
              <FeedbackButton />
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800"
                >
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://docs.formizee.com"
                    className="text-neutral-600 dark:text-neutral-400"
                  >
                    <BookIcon />
                    <span>Documentation</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <EndpointsContent workspaceSlug={props.workspaceSlug} />
      </SidebarContent>
      <Account userId={session.user.id} />
    </Sidebar>
  );
};
