'use client';

import {ArrowRightIcon, LoadingIcon, PlusIcon} from '@formizee/ui/icons';
import emailIcon from '@/../public/email.webp';
import Image from 'next/image';

import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {api} from '@/trpc/client';
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
import {useState} from 'react';

const formSchema = z.object({
  email: z.string().email()
});

export const AddLinkedEmailButton = () => {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
    }
  });

  const utils = api.useUtils();

  const addLinkedEmail = api.user.emails.create.useMutation({
    onError: error => {
      toast({
        variant: 'destructive',
        description: error.message
      });
    },
    onSuccess: async () => {
      setOpen(false);
      utils.user.emails.invalidate();
      toast({
        title: 'Verify Email',
        description: 'A verification link has been sent to your new email.'
      });
    }
  });

  const onSubmit = form.handleSubmit(data =>
    addLinkedEmail.mutate({email: data.email})
  );

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(open => !open)}>
        Add Email
        <PlusIcon />
      </Button>
      <div className="hidden">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="rounded-lg border-neutral-200 dark:border-neutral-800">
            <DialogHeader>
              <DialogTitle className="w-full flex flex-col gap-6 items-center text-left text-xl font-bold">
                <Image
                  src={emailIcon}
                  alt="Email Icon"
                  width={64}
                  height={64}
                  className="dark:rounded-[0.65rem] rounded-xl border-4 dark:border dark:border-neutral-600 border-neutral-300 shadow-md shadow-neutral-950"
                />
                New Linked Email
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={onSubmit}
                className="flex w-full flex-col justify-between gap-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormMessage className="text-xs text-red-600 dark:text-red-400" />
                      <FormControl>
                        <Input type="email" autoComplete="email" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button variant="outline" className="mt-4" type="submit">
                  {addLinkedEmail.isLoading ? (
                    <LoadingIcon className="size-8" />
                  ) : (
                    <div className="group flex flex-row w-full items-center justify-center gap-2">
                      <span>Send Verification Email</span>{' '}
                      <ArrowRightIcon className="transition-all w-0 group-hover:w-6" />
                    </div>
                  )}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};
