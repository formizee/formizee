import {
  ClipboardButton,
  SettingsCard,
  SettingsCardContent,
  SettingsCardFooter,
  SettingsCardFooterLabel,
  SettingsCardLabel,
  SettingsCardTitle
} from '@/components';
import {Button, Input} from '@formizee/ui';
import {Transition} from '@/components';
import type {schema} from '@/lib/db';

const GeneralSettings = ({user}: {user: schema.User}) => {
  return (
    <Transition className="flex flex-col py-6 gap-6">
      <SettingsCard>
        <SettingsCardTitle>Display Name</SettingsCardTitle>
        <SettingsCardContent>
          <SettingsCardLabel>
            This name will be visible by the members of your workspaces.
          </SettingsCardLabel>
          <Input
            required
            defaultValue={user.name}
            placeholder="Your Display Name"
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
        <SettingsCardTitle>Username</SettingsCardTitle>
        <SettingsCardContent>
          <SettingsCardLabel>
            This is your URL namespace within Formizee.
          </SettingsCardLabel>
          <Input
            required
            defaultValue={user.slug}
            placeholder="your-user-name"
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
            This is your user ID within Formizee.
          </SettingsCardLabel>
          <div className="flex items-center justify-between max-w-96 border rounded-md border py-2 pl-2 pr-0 text-sm h-9 border-neutral-200 dark:border-neutral-800">
            {user.id}
            <ClipboardButton
              data={user.id}
              description="Your User ID is copied to your clipboard."
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
