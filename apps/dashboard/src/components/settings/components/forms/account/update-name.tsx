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

interface Props {
  defaultValue: string;
  userId: string;
}

const formSchema = z.object({
  newName: z
    .string()
    .min(4, 'The name should be between 4 and 64 characters')
    .max(64, 'The name should be between 4 and 64 characters')
});

export const UpdateUserNameForm = (props: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newName: props.defaultValue
    }
  });

  const utils = api.useUtils();

  const updateUser = api.user.updateName.useMutation({
    onError: error => {
      toast({
        variant: 'destructive',
        description: error.message
      });
    },
    onSuccess: () => {
      utils.user.invalidate();
      setTimeout(() => updateUser.reset(), 1500);
    }
  });

  const ButtonContent = () => {
    if (updateUser.isLoading) {
      return <LoadingIcon className="size-8" />;
    }

    return <span>Update</span>;
  };

  const onSubmit = form.handleSubmit(data => {
    updateUser.mutate({
      id: props.userId,
      name: data.newName
    });
  });
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-row gap-2 items-end mt-4">
        <FormField
          control={form.control}
          name="newName"
          render={({field}) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <FormDescription className="text-xs text-neutral-600 dark:text-neutral-400">
                {' '}
                This name will be visible by the members of your workspaces.{' '}
              </FormDescription>
              <FormControl>
                <Input
                  required
                  maxLength={64}
                  autoComplete="off"
                  className="w-96"
                  placeholder="My Cool Name..."
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
          disabled={updateUser.isLoading}
          type="submit"
        >
          <ButtonContent />
        </Button>
      </form>
    </Form>
  );
};
