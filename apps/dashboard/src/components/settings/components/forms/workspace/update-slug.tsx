'use client';

import {Input, Button, toast} from '@formizee/ui';
import {LoadingIcon} from '@formizee/ui/icons';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@formizee/ui/form';

import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {api} from '@/trpc/client';
import {z} from 'zod';
import {useRouter} from 'next/navigation';

interface Props {
  defaultValue: string;
  workspaceId: string;
}

const formSchema = z.object({
  newSlug: z
    .string()
    .min(4, {message: 'The slug must be between 4 and 64 characters long.'})
    .max(64, {message: 'The slug must be between 4 and 64 characters long.'})
    .regex(/^[a-z0-9.-]+$/, {
      message:
        'The slug must contain only lowercase letters, numbers and hyphens, with no space or special characters.'
    })
});

export const UpdateWorkspaceSlugForm = (props: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newSlug: props.defaultValue
    }
  });

  const router = useRouter();

  const updateworkspace = api.workspace.updateSlug.useMutation({
    onError: error => {
      toast({
        variant: 'destructive',
        description: error.message
      });
    },
    onSuccess: () => {
      router.push('/');
    }
  });

  const ButtonContent = () => {
    if (updateworkspace.isLoading) {
      return <LoadingIcon className="size-8" />;
    }

    return <span>Update</span>;
  };

  const onSubmit = form.handleSubmit(data => {
    updateworkspace.mutate({
      id: props.workspaceId,
      slug: data.newSlug
    });
  });
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-row gap-2 items-end mt-8">
        <FormField
          control={form.control}
          name="newSlug"
          render={({field}) => (
            <FormItem>
              <FormLabel>Workspace Slug</FormLabel>
              <FormDescription className="text-xs text-neutral-600 dark:text-neutral-400">
                This is your URL namespace within Formizee.
              </FormDescription>
              <FormControl>
                <Input
                  required
                  maxLength={64}
                  autoComplete="off"
                  className="w-96"
                  placeholder="my-cool-slug"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs max-w-96 text-red-500 dark:text-red-400" />
            </FormItem>
          )}
        />
        <Button
          variant="outline"
          className="flex flex-row items-center justify-center w-20"
          disabled={updateworkspace.isLoading}
          type="submit"
        >
          <ButtonContent />
        </Button>
      </form>
    </Form>
  );
};
