'use client';

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  toast
} from '@formizee/ui';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@formizee/ui/form';
import {zodResolver} from '@hookform/resolvers/zod';
import {LoadingIcon} from '@formizee/ui/icons';
import trashIcon from '@/../public/trash.webp';
import {useRouter} from 'next/navigation';
import {useForm} from 'react-hook-form';
import {api} from '@/trpc/client';
import Image from 'next/image';
import {z} from 'zod';

const formSchema = z.object({
  description: z.enum(['delete my form'], {
    message: 'The input does not match.'
  })
});

export const DeleteButton = ({endpointId}: {endpointId: string}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  const router = useRouter();

  const deleteEndpoint = api.endpoint.delete.useMutation({
    onError: error => {
      toast({
        variant: 'destructive',
        description: error.message,
        title: "Form can't be deleted"
      });
    },
    onSuccess: () => {
      router.push('/');
    }
  });

  const onSubmit = form.handleSubmit(() => {
    deleteEndpoint.mutate({id: endpointId});
  });

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="destructive">Delete Permanently</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-4">
          <DialogTitle className="w-full flex flex-col gap-6 items-center text-left text-xl font-bold">
            <Image
              src={trashIcon}
              alt="Form Icon"
              width={64}
              height={64}
              className="dark:rounded-[0.65rem] rounded-xl border-4 dark:border dark:border-neutral-600 border-neutral-300 shadow-md shadow-neutral-950"
            />
            Delete Form
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={onSubmit}
            className="flex w-full flex-col justify-between gap-y-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({field}) => (
                <FormItem>
                  <FormLabel>
                    To verify, type <b>delete my form</b> below:
                  </FormLabel>
                  <FormControl>
                    <Input required autoComplete="off" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <Button
              variant="destructive"
              className="mt-4"
              disabled={deleteEndpoint.isLoading}
              type="submit"
            >
              {deleteEndpoint.isLoading ? (
                <LoadingIcon className="size-8" />
              ) : (
                <div className="group flex flex-row w-full items-center justify-center gap-2">
                  Delete Permanently
                </div>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteButton;
