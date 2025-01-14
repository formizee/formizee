import {WorkspaceGeneralPageLoading} from '../../components/skeletons';
import {Button, Input, Label, Separator, toast} from '@formizee/ui';
import {PageError} from '../../components/error';
import Transition from '@/components/transition';
import workspaceIcon from '@/../public/work.webp';
import {api} from '@/trpc/client';
import Image from 'next/image';
import {
  UpdateWorkspaceNameForm,
  UpdateWorkspaceSlugForm
} from '../../components/forms/workspace';

interface Props {
  workspaceSlug: string;
}

export const SettingsWorkspaceGeneral = (props: Props) => {
  const {data, isLoading, error} = api.workspace.get.useQuery({
    slug: props.workspaceSlug
  });

  if (isLoading) {
    return <WorkspaceGeneralPageLoading />;
  }

  if (error) {
    return <PageError />;
  }

  const workspace = data;

  return (
    <Transition className="flex flex-col w-full">
      <div className="flex gap-4 my-4">
        <Image
          priority
          height={48}
          width={48}
          src={workspaceIcon}
          alt="Workspace Icon"
          className="z-[999] size-14 dark:border-2 rounded-xl border-4 dark:border dark:border-neutral-600 border-neutral-300 shadow-md shadow-neutral-950"
        />
        <div className="flex flex-col max-w-96">
          <span className="font-regular truncate mr-2">{workspace.name}</span>
          <span className="font-secondary text-sm text-neutral-600 dark:text-neutral-400 font-regular max-w-[12.5rem] truncate">
            {workspace.slug}
          </span>
        </div>
      </div>
      <h1 className="font-semibold mt-4">Workspace Information</h1>
      <Separator className="mt-2 w-full" />
      <UpdateWorkspaceNameForm
        workspaceId={workspace.id}
        defaultValue={workspace.name ?? ''}
      />
      <UpdateWorkspaceSlugForm
        workspaceId={workspace.id}
        defaultValue={workspace.slug ?? ''}
      />
      <div className="flex items-end gap-2 mt-8">
        <div className="flex flex-col gap-2">
          <Label htmlFor="id" className="text-sm">
            Formizee ID
          </Label>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            This is your workspace identifier within Formizee.
          </p>
          <Input
            id="id"
            disabled
            className="w-96"
            defaultValue={workspace.id}
          />
        </div>
        <Button
          onClick={async () => {
            await navigator.clipboard.writeText(workspace.id);
            toast({
              description: 'The Workspace ID is copied to your clipboard!'
            });
          }}
          variant="outline"
        >
          Copy
        </Button>
      </div>
      <div className="flex flex-col items-start gap-2 mt-8">
        <div className="flex flex-col gap-2">
          <span className="text-sm">Delete Workspace</span>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-[500px]">
            Permanently remove this worspace and all of its contents from
            Formizee. This action is not reversible, so please continue with
            caution.
          </p>
        </div>
        <Button
          onClick={() =>
            toast({
              variant: 'destructive',
              title: 'Action Not Allowed',
              description:
                'You cannot delete your main workspace, instead delete your account if you would.'
            })
          }
          variant="outline"
          className="text-red-500 dark:hover:bg-red-500 hover:bg-red-500 dark:hover:text-neutral-950 hover:text-neutral-50 mt-2"
        >
          Delete Permanently
        </Button>
      </div>
    </Transition>
  );
};
