import {
  SettingsCard,
  SettingsCardContent,
  SettingsCardFooter,
  SettingsCardFooterLabel,
  SettingsCardLabel,
  SettingsCardTitle
} from './_components';
import {Button, Input} from '@formizee/ui';
import {redirect} from 'next/navigation';
import {Transition} from '@/components';
import {auth} from '@/lib/auth';

const GeneralSettings = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  return (
    <Transition className="flex flex-col py-6 gap-6">
      <SettingsCard>
        <SettingsCardTitle>Display Name</SettingsCardTitle>
        <SettingsCardContent>
          <SettingsCardLabel>
            This name will be visible by the members of your workspaces.
          </SettingsCardLabel>
          <Input required placeholder="My Cool Name" className="max-w-96" />
        </SettingsCardContent>
        <SettingsCardFooter>
          <SettingsCardFooterLabel>
            Please use between 4 and 64 characters
          </SettingsCardFooterLabel>
          <Button>Save</Button>
        </SettingsCardFooter>
      </SettingsCard>
      <SettingsCard>
        <SettingsCardTitle>Username</SettingsCardTitle>
        <SettingsCardContent>
          <SettingsCardLabel>
            This is your URL namespace within Formizee.
          </SettingsCardLabel>
          <Input required placeholder="my-cool-slug" className="max-w-96" />
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
            This is your user ID within Formizee.
          </SettingsCardLabel>
          <Input disabled defaultValue="id_sEjsdf323oid" className="max-w-96" />
        </SettingsCardContent>
        <SettingsCardFooter>
          <SettingsCardLabel>
            Used when interacting with the Formizee API.
          </SettingsCardLabel>
        </SettingsCardFooter>
      </SettingsCard>
      <SettingsCard variant="destructive">
        <SettingsCardTitle>Delete Account</SettingsCardTitle>
        <SettingsCardContent>
          <SettingsCardLabel>
            Permanently remove your Personal Account and all of its contents
            from Formizee. This action is not reversible, so please continue
            with caution.
          </SettingsCardLabel>
        </SettingsCardContent>
        <SettingsCardFooter variant="destructive" align="right">
          <Button variant="destructive">Delete Permanently</Button>
        </SettingsCardFooter>
      </SettingsCard>
    </Transition>
  );
};

export default GeneralSettings;
