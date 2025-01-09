'use client';

import {LoadingIcon} from '@formizee/ui/icons';
import trashIcon from '@/../public/trash.webp';
import Image from 'next/image';

import {zodResolver} from '@hookform/resolvers/zod';
import {useRouter} from 'next/navigation';
import {useForm} from 'react-hook-form';
import {api} from '@/trpc/client';
import {useState} from 'react';
import {z} from 'zod';

import {
  Input,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

interface Props {
  id: string;
}

const formSchema = z.object({
  description: z.string().regex(/^delete my form/, {
    message: 'You must type "delete my form" exactly to continue.'
  })
});

export const DeleteEndpointDialog = (props: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: ''
    }
  });

  const [open, setOpen] = useState(false);
  const router = useRouter();

  const deleteEndpoint = api.endpoint.delete.useMutation({
    onError: error => {
      toast({
        variant: 'destructive',
        description: error.message
      });
    },
    onSuccess: () => {
      router.replace('/');
    }
  });

  const onSubmit = form.handleSubmit(() => {
    deleteEndpoint.mutate({id: props.id});
  });
  return (
    <>
      <Button
        onClick={() => setOpen(open => !open)}
        variant="outline"
        className="text-red-500 dark:hover:bg-red-500 hover:bg-red-500 dark:hover:text-neutral-950 hover:text-neutral-50 mt-2"
      >
        Delete Permanently
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-2">
          <DialogHeader className="mb-4">
            <DialogTitle className="w-full flex flex-col gap-6 items-center text-left text-xl font-bold">
              <Image
                src={trashIcon}
                alt="Trash Icon"
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
    </>
  );
};
