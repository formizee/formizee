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
  Account,
  New
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
              <New workspaceSlug={props.workspaceSlug} />
              <Search />
              <Settings />
              <Feedback
                userId={session.user.id}
                userName={session.user.name ?? 'No Available'}
              />
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
