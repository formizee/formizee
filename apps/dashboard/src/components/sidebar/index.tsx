import {WorkspaceSwitch} from './workspace';
import {CreateButton} from './create';
import {Endpoints} from './endpoints';
import {Logo} from '@formizee/ui';
import {auth} from '@/lib/auth';
import {redirect} from 'next/navigation';

interface SidebarProps {
  workspaceSlug: string;
  endpointSlug: string;
}

export const Sidebar = async (props: SidebarProps) => {
  const session = await auth();

  if (!session) {
    redirect('/');
  }

  return (
    <div className="p-2 flex flex-col h-screen min-w-56 border-neutral-200 dark:border-r-neutral-800 border-r">
      <div className="flex flex-row items-center h-14 pl-2 mb-2 gap-5">
        <Logo />
        <span className="px-3 border select-none border-neutral-300 dark:border-neutral-700 rounded-xl text-sm tex-neutral-700 dark:text-neutral-100">
          Beta
        </span>
      </div>
      <WorkspaceSwitch workspaceSlug={props.workspaceSlug} />
      <Endpoints
        workspaceSlug={props.workspaceSlug}
        endpointSlug={props.endpointSlug}
      />
      <CreateButton workspaceSlug={props.workspaceSlug} />
    </div>
  );
};
