import {
  SettingsCard,
  SettingsCardContent,
  SettingsCardFooter,
  SettingsCardFooterLabel,
  SettingsCardLabel,
  SettingsCardTitle,
  Transition
} from '@/components';
import {Button, Input, Skeleton} from '@formizee/ui';
import type {schema} from '@/lib/db';
import DeleteButton from '../_components/delete-dialog';
import {LoadingIcon} from '@formizee/ui/icons';

interface Props {
  endpoint: schema.Endpoint | null;
}

export const Settings = ({endpoint}: Props) => {
  return (
    <Transition className="flex flex-col py-6 gap-6">
      <SettingsCard>
        <SettingsCardTitle>Form Name</SettingsCardTitle>
        <SettingsCardContent>
          <SettingsCardLabel>
            This name will be visible by the members of your workspaces.
          </SettingsCardLabel>
          {endpoint ? (
            <Input
              required
              maxLength={64}
              className="max-w-96"
              placeholder="My Endpoint"
              defaultValue={endpoint.name ?? endpoint.slug}
            />
          ) : (
            <Skeleton className="max-w-96 h-9" />
          )}
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
          {endpoint ? (
            <Input
              required
              defaultValue={endpoint.slug}
              placeholder="your-user-name"
              className="max-w-96"
            />
          ) : (
            <Skeleton className="max-w-96 h-9" />
          )}
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
          {endpoint ? (
            <DeleteButton endpointId={endpoint.id} />
          ) : (
            <Button disabled variant="destructive">
              <LoadingIcon className="size-8" />
            </Button>
          )}
        </SettingsCardFooter>
      </SettingsCard>
    </Transition>
  );
};
