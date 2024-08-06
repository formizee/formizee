import {WorkspaceSwitch} from './workspace';
import {CreateButton} from './create';
import {Endpoints} from './endpoints';
import {Logo} from '@formizee/ui';

interface SidebarProps {
  workspaceSlug: string;
  endpointSlug: string;
}

export const Sidebar = (props: SidebarProps) => {
  return (
    <div className="p-2 flex flex-col min-h-screen min-w-56 bg-neutral-950 border-r-neutral-800 border-r">
      <div className="flex flex-row items-center h-14 pl-2 mb-2 gap-5">
        <Logo />
        <span className="px-3 border border-neutral-700 rounded-xl text-sm text-neutral-100">
          Beta
        </span>
      </div>
      <CreateButton workspaceSlug={props.workspaceSlug} />
      <Endpoints
        workspaceSlug={props.workspaceSlug}
        endpointSlug={props.endpointSlug}
      />
      <WorkspaceSwitch />
    </div>
  );
};
