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
  workspaceSlug: string;
}

const formSchema = z.object({
  slug: z
    .string()
    .min(4, {message: 'The slug must be between 4 and 64 characters long.'})
    .max(64, {
      message: 'The slug must be between 4 and 64 characters long.'
    })
    .regex(/^[a-z0-9.-]+$/, {
      message:
        'The slug must contain only lowercase letters, numbers adn hyphens, with no space or special characters.'
    })
});

export const UpdateSlugCard = (props: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slug: props.workspaceSlug
    }
  });

  const updateSlug = api.workspace.updateSlug.useMutation({
    onError: error => {
      toast({
        variant: 'destructive',
        description: error.message,
        title: "Workspace name can't be updated"
      });
    }
  });

  const onSubmit = form.handleSubmit(data => {
    if (data.slug !== props.workspaceSlug) {
      updateSlug.mutate({
        id: props.workspaceId,
        slug: data.slug
      });
    }
  });

  return (
    <SettingsCard>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <SettingsCardTitle>Workspace Slug</SettingsCardTitle>
          <SettingsCardContent>
            <SettingsCardLabel>
              This is your URL namespace within Formizee.
            </SettingsCardLabel>

            <FormField
              control={form.control}
              name="slug"
              render={({field}) => (
                <FormItem>
                  <FormMessage className="text-xs text-red-600 dark:text-red-400" />
                  <FormControl>
                    <Input
                      required
                      autoComplete="off"
                      placeholder="your-workspace-slug"
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
            <Button disabled={updateSlug.isLoading} type="submit">
              {updateSlug.isLoading ? (
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
