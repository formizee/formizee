import {
  SettingsCard,
  SettingsCardContent,
  SettingsCardFooter,
  SettingsCardFooterLabel,
  SettingsCardLabel,
  SettingsCardTitle,
  Transition
} from '@/components';
import {Button, Input} from '@formizee/ui';
import type {schema} from '@/lib/db';

export const Settings = ({endpoint}: {endpoint: schema.Endpoint}) => {
  return (
    <Transition className="flex flex-col py-6 gap-6">
      <SettingsCard>
        <SettingsCardTitle>Form Name</SettingsCardTitle>
        <SettingsCardContent>
          <SettingsCardLabel>
            This name will be visible by the members of your workspaces.
          </SettingsCardLabel>
          <Input
            required
            maxLength={64}
            className="max-w-96"
            placeholder="My Endpoint"
            defaultValue={endpoint.name ?? endpoint.slug}
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
        <SettingsCardTitle>Form Slug</SettingsCardTitle>
        <SettingsCardContent>
          <SettingsCardLabel>
            This is your form URL namespace within Formizee.
          </SettingsCardLabel>
          <Input
            required
            defaultValue={endpoint.slug}
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
      <SettingsCard variant="destructive">
        <SettingsCardTitle>Delete Form</SettingsCardTitle>
        <SettingsCardContent>
          <SettingsCardLabel>
            Permanently remove this form and all of its contents from Formizee.
            This action is not reversible, so please continue with caution.
          </SettingsCardLabel>
        </SettingsCardContent>
        <SettingsCardFooter variant="destructive" align="right">
          <Button variant="destructive">Delete Permanently</Button>
        </SettingsCardFooter>
      </SettingsCard>
    </Transition>
  );
};
