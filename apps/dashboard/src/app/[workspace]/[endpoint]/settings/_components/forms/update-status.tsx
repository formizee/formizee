'use client';

import {toast, Switch, Label} from '@formizee/ui';
import {api} from '@/trpc/client';

interface Props {
  workspaceSlug: string;
  endpointSlug: string;
  defaultValue: boolean;
  id: string;
}

export const UpdateEndpointStatusForm = (props: Props) => {
  const utils = api.useUtils();

  const updateEndpoint = api.endpoint.update.status.useMutation({
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
        {...previousState, isEnabled: newState.isEnabled}
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

  const onCheckedChange = (isEnabled: boolean) => {
    updateEndpoint.mutate({
      id: props.id,
      isEnabled
    });
  };
  return (
    <div className="flex flex-col items-start gap-2 mt-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="form-status-switch" className="text-sm">
          Form Status
        </Label>
        <div className="flex flex-col gap-4 sm:gap-0 sm:flex-row justify-between sm:w-[26.5rem]">
          <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-[500px]">
            This checks if the form is still accepting submissions
          </p>
          <Switch
            id="form-status-switch"
            checked={props.defaultValue}
            onCheckedChange={onCheckedChange}
            className="mb-2"
          />
        </div>
      </div>
    </div>
  );
};
