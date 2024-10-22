import {Transition} from '@/components';
import {
  SettingsCard,
  SettingsCardContent,
  SettingsCardFooter,
  SettingsCardFooterLabel,
  SettingsCardLabel,
  SettingsCardTitle
} from '@/components';
import {Button} from '@formizee/ui';

const SecuritySettings = () => (
  <Transition className="flex flex-col py-2 gap-4">
    <SettingsCard>
      <SettingsCardTitle>Multifactor Authentication (MFA)</SettingsCardTitle>
      <SettingsCardContent>
        <SettingsCardLabel>
          Protect your account by adding a extra layer of security.
        </SettingsCardLabel>
      </SettingsCardContent>
      <SettingsCardFooter>
        <SettingsCardFooterLabel>
          This feature will be enabled as soon as possible.
        </SettingsCardFooterLabel>
        <Button disabled variant="outline">
          Coming Soon
        </Button>
      </SettingsCardFooter>
    </SettingsCard>
  </Transition>
);

export default SecuritySettings;
