import Transition from '@/components/transition';
import {
  ClipboardButton,
  SettingsCard,
  SettingsCardContent,
  SettingsCardFooter,
  SettingsCardFooterLabel,
  SettingsCardLabel,
  SettingsCardTitle
} from '@/components';
import {handleTrpcServerAction} from '@/trpc/utils';
import {api} from '@/trpc/server';
import {redirect} from 'next/navigation';
import {UpdateNameCard} from './_components/cards';
import {UpdateSlugCard} from './_components/cards/update-slug';
import {DeleteWorkspaceCard} from './_components/cards/delete-workspace';

interface Params {
  workspaceSlug: string;
}

const General = async ({params}: {params: Params}) => {
  const workspace = await handleTrpcServerAction(
    api.workspace.getBySlug.query({slug: params.workspaceSlug})
  );

  if (!workspace.name) {
    redirect('/');
  }

  return (
    <Transition className="flex flex-col mt-4 py-6 gap-6">
      <UpdateNameCard
        workspaceId={workspace.id}
        workspaceName={workspace.name}
      />
      <UpdateSlugCard
        workspaceId={workspace.id}
        workspaceSlug={workspace.slug}
      />
      <SettingsCard>
        <SettingsCardTitle>Formizee ID</SettingsCardTitle>
        <SettingsCardContent>
          <SettingsCardLabel>
            This is your workspace ID within Formizee.
          </SettingsCardLabel>
          <div className="flex items-center justify-between max-w-96 border rounded-md border py-2 pl-2 pr-0 text-sm h-9 border-neutral-200 dark:border-neutral-800">
            {workspace.id}
            <ClipboardButton
              data={workspace.id}
              description="The Workspace ID is copied to your clipboard."
              className="border-none hover:bg-transparent bg-transparent shadow-none"
            />
          </div>
        </SettingsCardContent>
        <SettingsCardFooter>
          <SettingsCardFooterLabel>
            Used when interacting with the Formizee API.
          </SettingsCardFooterLabel>
        </SettingsCardFooter>
      </SettingsCard>
      <DeleteWorkspaceCard />
    </Transition>
  );
};

export default General;
