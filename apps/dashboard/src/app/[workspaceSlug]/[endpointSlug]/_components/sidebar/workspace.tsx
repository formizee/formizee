import {handleTrpcServerAction} from '@/trpc/utils';
import {api} from '@/trpc/server';
import {Button} from '@formizee/ui';

export const WorkspaceSwitch = async ({
  workspaceSlug
}: {workspaceSlug: string}) => {
  const currentWorkspace = await handleTrpcServerAction(
    api.workspace.getBySlug.query({slug: workspaceSlug})
  );

  return (
    <Button variant="ghost" className="h-16 mb-2">
      {currentWorkspace.name}
    </Button>
  );
};
