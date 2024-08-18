import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Skeleton
} from '@formizee/ui';
import {CheckIcon, EllipsisIcon, UserGroupIcon} from '@formizee/ui/icons';
import workspaceIcon from '@/../public/workspace.webp';
import {handleTrpcServerAction} from '@/trpc/utils';
import {api} from '@/trpc/server';
import Image from 'next/image';

interface WorkspaceItemProps {
  selected: boolean;
  name: string;
  slug: string;
}

const WorkspaceItem = (props: WorkspaceItemProps) => {
  return (
    <Button
      variant="ghost"
      className="flex flex-row items-center justify-start p-2 w-full h-12"
    >
      <div className="flex items-center justify-center size-8 rounded-md bg-neutral-600 dark:bg-neutral-400">
        <span className="fixed text-neutral-50 dark:text-neutral-950 font-bold">
          {props.slug.split('')[0]?.toUpperCase()}
        </span>
      </div>
      <div className="flex flex-col items-start ml-1 flex-1">
        <span className="text-sm">{props.name}</span>
        <span className="text-xs text-neutral-600 dark:text-neutral-400">
          {props.slug}
        </span>
      </div>
      {props.selected ? (
        <CheckIcon className="mx-2 text-amber-600 dark:text-amber-400" />
      ) : (
        <></>
      )}
    </Button>
  );
};

export const WorkspaceSwitch = async ({
  workspaceSlug
}: {workspaceSlug: string}) => {
  const currentWorkspace = await handleTrpcServerAction(
    api.workspace.getBySlug.query({slug: workspaceSlug})
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-16 mb-2 p-0">
          <div className="flex flex-row w-full h-full items-center pl-2 gap-2">
            <div className="flex items-center justify-center size-8 dark:size-9 dark:bg-neutral-700 rounded-md">
              <Skeleton className="fixed size-8" />
              <Image
                className="z-20 size-8"
                src={workspaceIcon}
                alt="Workspace Icon"
              />
            </div>
            {currentWorkspace.name}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        className="flex flex-col items-center border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 gap-2 p-1"
      >
        <div className="flex flex-row items-center justify-between w-full px-2 py-1">
          <span className="text-start px-2 py-1 w-full text-xs text-neutral-600 dark:text-neutral-400">
            Personal Workspace
          </span>
          <Button
            variant="ghost"
            className="flex items-center justify-center size-6 p-0"
          >
            <EllipsisIcon className="text-neutral-600 dark:text-neutral-400" />
          </Button>
        </div>
        <WorkspaceItem
          name={currentWorkspace.name ?? currentWorkspace.slug}
          slug={currentWorkspace.slug}
          selected={true}
        />
        <div className="h-[1px] w-full bg-neutral-200 dark:bg-neutral-800" />
        <span className="text-start px-2 py-1 w-full text-xs text-neutral-600 dark:text-neutral-400">
          Team Workspaces
        </span>
        <Button
          disabled
          variant="ghost"
          className="flex flex-row items-center justify-start p-2 w-full h-12 mb-1"
        >
          <div className="flex items-center justify-center size-8 rounded-md bg-neutral-600 dark:bg-neutral-400">
            <UserGroupIcon className="text-neutral-50 dark:text-neutral-950 size-5" />
          </div>
          <div className="flex flex-col items-start ml-1 flex-1">
            <span>Team Workspaces</span>
            <span className="text-xs text-neutral-600 dark:text-neutral-400">
              coming soon
            </span>
          </div>
        </Button>
      </PopoverContent>
    </Popover>
  );
};
