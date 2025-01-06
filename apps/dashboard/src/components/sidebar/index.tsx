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
  workspace: string;
}

export const AppSidebar = async (props: AppSidebarProps) => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  return (
    <Sidebar className="bg-white/80 dark:bg-black/80 backdrop-blur-sm dark:border-neutral-800">
      <Header />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <New workspaceSlug={props.workspace} />
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
        <Endpoints workspaceSlug={props.workspace} />
      </SidebarContent>
      <Account userId={session.user.id} />
    </Sidebar>
  );
};
