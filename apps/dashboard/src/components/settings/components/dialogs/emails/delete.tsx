'use client';

import {LoadingIcon} from '@formizee/ui/icons';
import trashIcon from '@/../public/trash.webp';
import Image from 'next/image';
import {z} from 'zod';

import {api} from '@/trpc/client';

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
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import type {Dispatch, SetStateAction} from 'react';

interface Props {
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  email: string;
}

const formSchema = z.object({
  description: z.string().regex(/^delete linked email/, {
    message: 'You must type "delete linked email" exactly to continue.'
  })
});

export const DeleteEmailDialog = (props: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: ''
    }
  });

  const utils = api.useUtils();

  const deleteEmail = api.user.emails.delete.useMutation({
    onError: error => {
      toast({
        variant: 'destructive',
        description: error.message
      });
    },
    onSuccess: () => {
      props.setOpen(false);
      utils.user.emails.invalidate();
    }
  });

  const onSubmit = form.handleSubmit(() => {
    deleteEmail.mutate({email: props.email});
  });
  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogContent className="border-2">
        <DialogHeader className="mb-4">
          <DialogTitle className="w-full flex flex-col gap-6 items-center text-left text-xl font-bold">
            <Image
              priority
              src={trashIcon}
              alt="Trash Icon"
              width={64}
              height={64}
              className="dark:rounded-[0.65rem] rounded-xl border-4 dark:border dark:border-neutral-600 border-neutral-300 shadow-md shadow-neutral-950"
            />
            Remove Linked Email
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
                    To verify, type <b>delete linked email</b> below:
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
              disabled={deleteEmail.isLoading}
              type="submit"
            >
              {deleteEmail.isLoading ? (
                <LoadingIcon className="size-8" />
              ) : (
                <div className="group flex flex-row w-full items-center justify-center gap-2">
                  Remove
                </div>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
