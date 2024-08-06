import {Transition} from '@/components';
import {
  SettingsCard,
  SettingsCardContent,
  SettingsCardFooter,
  SettingsCardFooterLabel,
  SettingsCardLabel,
  SettingsCardTitle
} from './_components';
import {Button, Input} from '@formizee/ui';

const SecuritySettings = () => (
  <Transition className="flex flex-col py-6 gap-6">
    <SettingsCard>
      <SettingsCardTitle>Password</SettingsCardTitle>
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
      <SettingsCardTitle>Multifactor Authentication (MFA)</SettingsCardTitle>
      <SettingsCardContent>
        <SettingsCardLabel>
          Protect your account by adding a extra layer of security.
        </SettingsCardLabel>
        <Input required placeholder="my-cool-slug" className="max-w-96" />
      </SettingsCardContent>
      <SettingsCardFooter>
        <SettingsCardFooterLabel>
          This feature will be enabled as soon as possible.
        </SettingsCardFooterLabel>
        <Button>Coming Soon</Button>
      </SettingsCardFooter>
    </SettingsCard>
  </Transition>
);

export default SecuritySettings;
