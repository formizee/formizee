'use client';

import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {api} from '@/trpc/client';
import {Button, Input, toast} from '@formizee/ui';
import {
  SettingsCard,
  SettingsCardContent,
  SettingsCardFooter,
  SettingsCardFooterLabel,
  SettingsCardLabel,
  SettingsCardTitle
} from '@/components';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@formizee/ui/form';
import {LoadingIcon} from '@formizee/ui/icons';

interface Props {
  workspaceId: string;
  workspaceName: string;
}

const formSchema = z.object({
  name: z
    .string()
    .min(4, {message: 'The name must be between 4 and 64 characters long.'})
    .max(64, {message: 'The name must be between 4 and 64 characters long.'})
});

export const UpdateNameCard = (props: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: props.workspaceName
    }
  });

  const updateName = api.workspace.updateName.useMutation({
    onError: error => {
      toast({
        variant: 'destructive',
        description: error.message,
        title: "Workspace name can't be updated"
      });
    }
  });

  const onSubmit = form.handleSubmit(data => {
    if (data.name !== props.workspaceName) {
      updateName.mutate({
        id: props.workspaceId,
        name: data.name
      });
    }
  });

  return (
    <SettingsCard>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <SettingsCardTitle>Display Name</SettingsCardTitle>
          <SettingsCardContent>
            <SettingsCardLabel>
              This name will be visible by the members of the workspace.
            </SettingsCardLabel>

            <FormField
              control={form.control}
              name="name"
              render={({field}) => (
                <FormItem>
                  <FormMessage className="text-xs text-red-600 dark:text-red-400" />
                  <FormControl>
                    <Input
                      required
                      autoComplete="off"
                      placeholder="Your Workspace Name"
                      className="max-w-96"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </SettingsCardContent>
          <SettingsCardFooter>
            <SettingsCardFooterLabel>
              Please use between 4 and 64 characters
            </SettingsCardFooterLabel>
            <Button disabled={updateName.isLoading} type="submit">
              {updateName.isLoading ? (
                <LoadingIcon className="size-8" />
              ) : (
                <p>Save</p>
              )}
            </Button>
          </SettingsCardFooter>
        </form>
      </Form>
    </SettingsCard>
  );
};
