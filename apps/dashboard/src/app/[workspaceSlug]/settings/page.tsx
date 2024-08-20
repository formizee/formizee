import Transition from '@/components/transition';
import {Button, Input} from '@formizee/ui';
import {
  SettingsCard,
  SettingsCardContent,
  SettingsCardFooter,
  SettingsCardFooterLabel,
  SettingsCardLabel,
  SettingsCardTitle
} from '@/components';
import {handleTrpcServerAction} from '@/trpc/utils';
import {api} from '@/trpc/server';

interface Params {
  workspaceSlug: string;
}

const General = async ({params}: {params: Params}) => {
  const workspace = await handleTrpcServerAction(
    api.workspace.getBySlug.query({slug: params.workspaceSlug})
  );

  return (
    <Transition className="flex flex-col py-6 gap-6">
      <SettingsCard>
        <SettingsCardTitle>Display Name</SettingsCardTitle>
        <SettingsCardContent>
          <SettingsCardLabel>
            This name will be visible by the members of the workspace.
          </SettingsCardLabel>
          <Input
            required
            defaultValue={workspace.name ?? workspace.slug}
            placeholder="Your Workspace Name"
            className="max-w-96"
          />
        </SettingsCardContent>
        <SettingsCardFooter>
          <SettingsCardFooterLabel>
            Please use between 4 and 64 characters
          </SettingsCardFooterLabel>
          <Button>Save</Button>
        </SettingsCardFooter>
      </SettingsCard>
      <SettingsCard>
        <SettingsCardTitle>Workspace Slug</SettingsCardTitle>
        <SettingsCardContent>
          <SettingsCardLabel>
            This is your URL namespace within Formizee.
          </SettingsCardLabel>
          <Input
            required
            defaultValue={workspace.slug}
            placeholder="your-workspace-name"
            className="max-w-96"
          />
        </SettingsCardContent>
        <SettingsCardFooter>
          <SettingsCardFooterLabel>
            Please use between 4 and 64 characters
          </SettingsCardFooterLabel>
          <Button>Save</Button>
        </SettingsCardFooter>
      </SettingsCard>
      <SettingsCard>
        <SettingsCardTitle>Formizee ID</SettingsCardTitle>
        <SettingsCardContent>
          <SettingsCardLabel>
            This is your workspace ID within Formizee.
          </SettingsCardLabel>
          <Input disabled defaultValue={workspace.id} className="max-w-96" />
        </SettingsCardContent>
        <SettingsCardFooter>
          <SettingsCardFooterLabel>
            Used when interacting with the Formizee API.
          </SettingsCardFooterLabel>
        </SettingsCardFooter>
      </SettingsCard>
      <SettingsCard variant="destructive">
        <SettingsCardTitle>Delete Workspace</SettingsCardTitle>
        <SettingsCardContent>
          <SettingsCardLabel>
            Permanently remove this worspace and all of its contents from
            Formizee. This action is not reversible, so please continue with
            caution.
          </SettingsCardLabel>
        </SettingsCardContent>
        <SettingsCardFooter variant="destructive" align="right">
          <Button variant="destructive">Delete Permanently</Button>
        </SettingsCardFooter>
      </SettingsCard>
    </Transition>
  );
};

export default General;
