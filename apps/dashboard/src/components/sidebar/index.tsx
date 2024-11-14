import {redirect} from 'next/navigation';
import {auth} from '@/lib/auth';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu
} from '@formizee/ui/sidebar';
import {
  Header,
  Search,
  Settings,
  Feedback,
  Documentation,
  Endpoints,
  Account
} from './components';

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
      <Header />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <Search />
              <Settings />
              <Feedback />
              <Documentation />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <Endpoints workspaceSlug={props.workspaceSlug} />
      </SidebarContent>
      <Account userId={session.user.id} />
    </Sidebar>
  );
};
