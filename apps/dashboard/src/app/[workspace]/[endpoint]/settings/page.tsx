'use client';

import {Button, Input, Label, Separator, toast} from '@formizee/ui';
import {DeleteEndpointDialog} from './_components/dialogs';
import Transition from '@/components/transition';
import {api} from '@/trpc/client';
import ErrorPage from '../error';

import {
  UpdateEndpointNameForm,
  UpdateEndpointNotificationsForm,
  UpdateEndpointRedirectUrlForm,
  UpdateEndpointSlugForm,
  UpdateEndpointStatusForm,
  UpdateEndpointTargetEmailsForm
} from './_components/forms';
import {LoadingSkeleton} from './_components/skeleton';

interface Props {
  params: {
    workspace: string;
    endpoint: string;
  };
}

export default function Settings({params}: Props) {
  const workspaceRequest = api.workspace.get.useQuery({
    slug: params.workspace
  });
  const endpointRequest = api.endpoint.get.useQuery({
    workspaceSlug: params.workspace,
    endpointSlug: params.endpoint
  });

  if (workspaceRequest.isLoading || endpointRequest.isLoading) {
    return <LoadingSkeleton />;
  }

  if (workspaceRequest.error || endpointRequest.error) {
    return <ErrorPage />;
  }

  const workspace = workspaceRequest.data;
  const endpoint = endpointRequest.data;

  return (
    <Transition className="flex flex-col w-full ml-2 items-start">
      <h2 className="font-semibold mt-4">General Information</h2>
      <Separator className="mt-2 w-full" />
      <section className="w-full grid grid-cols-1 2xl:grid-cols-2 gap-4">
        <UpdateEndpointNameForm
          id={endpoint.id}
          defaultValue={endpoint.name ?? ''}
        />
        <UpdateEndpointSlugForm
          id={endpoint.id}
          slug={endpoint.slug}
          defaultValue={endpoint.slug}
        />
        <div className="flex items-end gap-2 mt-8">
          <div className="flex flex-col gap-2">
            <Label htmlFor="id" className="text-sm">
              Formizee ID
            </Label>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              This is your form identifier within Formizee.
            </p>
            <Input
              id="id"
              disabled
              className="w-96"
              defaultValue={endpoint.id}
            />
          </div>
          <Button
            onClick={async () => {
              await navigator.clipboard.writeText(endpoint.id);
              toast({
                description: 'The Form ID is copied to your clipboard!'
              });
            }}
            variant="outline"
          >
            Copy
          </Button>
        </div>
        <UpdateEndpointRedirectUrlForm
          id={endpoint.id}
          defaultValue={endpoint.redirectUrl}
        />
      </section>
      <h2 className="font-semibold mt-8">Notifications</h2>
      <Separator className="mt-2 w-full" />
      <section className="w-full grid grid-cols-1 2xl:grid-cols-2 gap-4">
        <UpdateEndpointNotificationsForm
          defaultValue={endpoint.emailNotifications}
          workspaceSlug={params.workspace}
          endpointSlug={params.endpoint}
          id={endpoint.id}
        />
        <UpdateEndpointTargetEmailsForm
          availableEmails={workspace.availableEmails}
          targetEmails={endpoint.targetEmails}
          workspaceSlug={params.workspace}
          endpointSlug={params.endpoint}
          id={endpoint.id}
        />
      </section>
      <h2 className="font-semibold mt-8 text-red-500">Danger Zone</h2>
      <Separator className="mt-2 w-full" />
      <section className="w-full grid grid-cols-1 2xl:grid-cols-2 gap-4">
        <UpdateEndpointStatusForm
          defaultValue={endpoint.isEnabled}
          workspaceSlug={params.workspace}
          endpointSlug={params.endpoint}
          id={endpoint.id}
        />
        <div className="flex flex-col items-start gap-2 mt-4 pb-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm">Delete Form</span>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-[500px]">
              Permanently Remove the form and all the submissions from Formizee.
            </p>
          </div>
          <DeleteEndpointDialog id={endpoint.id} />
        </div>
      </section>
    </Transition>
  );
}
