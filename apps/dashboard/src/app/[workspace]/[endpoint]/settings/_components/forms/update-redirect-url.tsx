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
  id: string;
}

const formSchema = z.object({
  newUrl: z.string().url()
});

export const UpdateEndpointRedirectUrlForm = (props: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newUrl: props.defaultValue
    }
  });

  const utils = api.useUtils();

  const updateEndpoint = api.endpoint.update.redirectUrl.useMutation({
    onError: error => {
      toast({
        variant: 'destructive',
        description: error.message
      });
    },
    onSuccess: () => {
      utils.endpoint.get.invalidate();
      setTimeout(() => updateEndpoint.reset(), 1500);
    }
  });

  const ButtonContent = () => {
    if (updateEndpoint.isLoading) {
      return <LoadingIcon className="size-8" />;
    }

    return <span>Update</span>;
  };

  const onSubmit = form.handleSubmit(data => {
    updateEndpoint.mutate({
      id: props.id,
      redirectUrl: data.newUrl
    });
  });
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-row gap-2 items-end mt-4">
        <FormField
          control={form.control}
          name="newUrl"
          render={({field}) => (
            <FormItem>
              <FormLabel>Redirect URL</FormLabel>
              <FormDescription className="text-xs text-neutral-600 dark:text-neutral-400">
                This is the webpage that you will see after submitting to your
                form.
              </FormDescription>
              <FormControl>
                <Input
                  required
                  maxLength={64}
                  autoComplete="off"
                  className="w-96"
                  placeholder="https://formizee.com/f/thanks-you"
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
          disabled={updateEndpoint.isLoading}
          type="submit"
        >
          <ButtonContent />
        </Button>
      </form>
    </Form>
  );
};
