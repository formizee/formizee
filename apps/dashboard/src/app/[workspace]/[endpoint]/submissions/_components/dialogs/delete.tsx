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
  DialogDescription,
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
  FormMessage
} from '@formizee/ui/form';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import type {Dispatch, SetStateAction} from 'react';

interface Props {
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  endpointId: string;
  submissionId: string;
}

const formSchema = z.object({
  description: z.string().regex(/^delete submission/, {
    message: 'You must type "delete submission" exactly to continue.'
  })
});

export const DeleteSubmissionDialog = (props: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: ''
    }
  });

  const utils = api.useUtils();

  const deleteSubmission = api.submission.delete.useMutation({
    onError: error => {
      toast({
        variant: 'destructive',
        description: error.message
      });
    },
    onSuccess: () => {
      props.setOpen(false);
      utils.submission.list.invalidate();
    }
  });

  const onSubmit = form.handleSubmit(() => {
    deleteSubmission.mutate({
      id: props.submissionId,
      endpointId: props.endpointId
    });
  });

  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogContent className="border-2">
        <DialogHeader>
          <DialogTitle className="w-full flex flex-col gap-6 items-center text-left text-xl font-bold">
            <Image
              priority
              src={trashIcon}
              alt="Trash Icon"
              width={64}
              height={64}
              className="dark:rounded-[0.65rem] rounded-xl border-4 dark:border dark:border-neutral-600 border-neutral-300 shadow-md shadow-neutral-950"
            />
            Delete Submission
          </DialogTitle>
          <DialogDescription className="pt-4">
            To verify, type <b>delete submission</b> below:
          </DialogDescription>
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
              disabled={deleteSubmission.isLoading}
              type="submit"
            >
              {deleteSubmission.isLoading ? (
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
