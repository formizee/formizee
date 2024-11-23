'use client';

import {toast, Switch, Label} from '@formizee/ui';
import {api} from '@/trpc/client';

interface Props {
  workspaceSlug: string;
  endpointSlug: string;
  defaultValue: boolean;
  id: string;
}

export const UpdateEndpointNotificationsForm = (props: Props) => {
  const utils = api.useUtils();

  const updateEndpoint = api.endpoint.update.notifications.useMutation({
    onMutate: async newState => {
      await utils.endpoint.get.cancel({
        workspaceSlug: props.workspaceSlug,
        endpointSlug: props.endpointSlug
      });

      const previousState = utils.endpoint.get.getData({
        workspaceSlug: props.workspaceSlug,
        endpointSlug: props.endpointSlug
      });

      if (previousState === undefined) {
        return;
      }

      utils.endpoint.get.setData(
        {
          workspaceSlug: props.workspaceSlug,
          endpointSlug: props.endpointSlug
        },
        {...previousState, emailNotifications: newState.notifications}
      );

      return {previousState};
    },
    onError: (error, _newEndpoint, context) => {
      toast({
        variant: 'destructive',
        description: error.message
      });
      utils.endpoint.get.setData(
        {
          workspaceSlug: props.workspaceSlug,
          endpointSlug: props.endpointSlug
        },
        context?.previousState
      );
    },
    onSettled: () => {
      utils.endpoint.get.invalidate();
    }
  });

  const onCheckedChange = (notifications: boolean) => {
    updateEndpoint.mutate({
      id: props.id,
      notifications
    });
  };
  return (
    <div className="flex flex-col items-start gap-2 mt-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email-notifications-switch" className="text-sm">
          Email Notifications
        </Label>
        <div className="flex flex-row justify-between w-[26.5rem]">
          <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-[500px]">
            When someone makes a submission, you will receive an email
          </p>
          <Switch
            id="email-notifications-switch"
            checked={props.defaultValue}
            onCheckedChange={onCheckedChange}
            className="mb-2"
          />
        </div>
      </div>
    </div>
  );
};
