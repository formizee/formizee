'use client';

import {LoadingIcon} from '@formizee/ui/icons';
import Image from 'next/image';

import {
  Input,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
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
import trashIcon from '@/../public/trash.webp';
import {useForm} from 'react-hook-form';
import {useState} from 'react';
import {z} from 'zod';
import {deleteUserAccount} from './actions';

const formSchema = z.object({
  description: z.string().regex(/^delete my account$/, {
    message: 'You must type "delete my account" exactly to continue.'
  })
});

export const DeleteUserDialog = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: ''
    }
  });

  const onSubmit = form.handleSubmit(async () => {
    setIsLoading(true);
    await deleteUserAccount();
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
        <DialogContent>
          <DialogHeader className="flex mb-4 items-center">
            <DialogTitle className="w-full flex flex-col gap-6 items-center text-left text-xl font-bold">
              <Image
                src={trashIcon}
                alt="Trash Icon"
                width={64}
                height={64}
                className="dark:rounded-[0.65rem] rounded-xl border-4 dark:border dark:border-neutral-600 border-neutral-300 shadow-md shadow-neutral-950"
              />
              Delete Account
            </DialogTitle>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center">
              You are about to permanently delete your{' '}
              <strong>Personal Account</strong>, including all{' '}
              <strong>forms, submissions, and settings</strong>. If you are the
              owner of any <strong>workspaces</strong>, those will also be
              permanently deleted, along with their contents and access for
              members.
            </p>
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
                      To verify, type <b>delete my account</b> below:
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
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? (
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
