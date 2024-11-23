'use client';

import {toast} from '@formizee/ui';
import {api} from '@/trpc/client';
import {MultiSelectInput} from '../multi-select';
import {useEffect, useState} from 'react';

interface Props {
  availableEmails: string[];
  targetEmails: string[];
  workspaceSlug: string;
  endpointSlug: string;
  id: string;
}

export const UpdateEndpointTargetEmailsForm = (props: Props) => {
  const [selectedEmails, setSelectedEmails] = useState(props.targetEmails);

  const updateEndpoint = api.endpoint.update.targetEmails.useMutation({
    onError: error => {
      toast({
        variant: 'destructive',
        description: error.message
      });
    }
  });

  useEffect(() => {
    if (props.targetEmails !== selectedEmails) {
      updateEndpoint.mutate({
        id: props.id,
        targetEmails: selectedEmails
      });
    }
  }, [selectedEmails]);

  return (
    <div className="flex flex-col gap-2 mt-4">
      <span className="text-sm">Target Emails</span>
      <p className="text-xs text-neutral-600 dark:text-neutral-400">
        These are the addresses that will receive the notifications
      </p>
      <MultiSelectInput
        emails={props.availableEmails}
        setSelectedValues={setSelectedEmails}
        selectedValues={selectedEmails}
      />
    </div>
  );
};
