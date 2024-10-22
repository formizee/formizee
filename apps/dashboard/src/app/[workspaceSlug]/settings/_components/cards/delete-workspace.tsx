'use client';

import {Button, toast} from '@formizee/ui';
import {
  SettingsCard,
  SettingsCardContent,
  SettingsCardFooter,
  SettingsCardLabel,
  SettingsCardTitle
} from '@/components';

export const DeleteWorkspaceCard = () => {
  const onClick = () => {
    toast({
      title: 'Unauthorized',
      variant: 'destructive',
      description: "You can't delete your personal workspace."
    });
  };

  return (
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
        <Button variant="destructive" onClick={onClick}>
          Delete Permanently
        </Button>
      </SettingsCardFooter>
    </SettingsCard>
  );
};
