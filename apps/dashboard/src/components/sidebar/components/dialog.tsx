'use client';

import {ArrowRightIcon, LoadingIcon} from '@formizee/ui/icons';
import formIcon from '@/../public/form.webp';
import {
  Input,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  toast
} from '@formizee/ui';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@formizee/ui/form';
import {api} from '@/trpc/client';
import {useRouter} from 'next/navigation';
import {generateSlug} from 'random-word-slugs';
import type {Dispatch, SetStateAction} from 'react';
import Image from 'next/image';

const formSchema = z.object({
  name: z
    .string()
    .min(4, 'Name is required and should be at least 4 characters')
    .max(64),
  slug: z
    .string()
    .min(4, 'Slug is required and should be at least 4 characters')
    .max(64)
});

interface Props {
  setOpen: Dispatch<SetStateAction<boolean>>;
  workspaceSlug: string;
  open: boolean;
}

export const CreateEndpointDialog = (props: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: generateSlug(2)
    }
  });

  const router = useRouter();

  const createEndpoint = api.endpoint.create.useMutation({
    onError: error => {
      toast({
        variant: 'destructive',
        description: error.message,
        title: "Form can't be created"
      });
    },
    onSuccess: newEndpoint => {
      props.setOpen(false);
      router.push(`/${props.workspaceSlug}/${newEndpoint.slug}`);
    }
  });

  const onSubmit = form.handleSubmit(data =>
    createEndpoint.mutate({
      workspaceSlug: props.workspaceSlug,
      targetEmails: [],
      ...data
    })
  );

  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogContent className="rounded-lg border-neutral-200 dark:border-neutral-800">
        <DialogHeader>
          <DialogTitle className="w-full flex flex-col gap-6 items-center text-left text-xl font-bold">
            <Image
              src={formIcon}
              alt="Form Icon"
              width={64}
              height={64}
              className="dark:rounded-[0.65rem] rounded-xl border-4 dark:border dark:border-neutral-600 border-neutral-300 shadow-md shadow-neutral-950"
            />
            Create New Form
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={onSubmit}
            className="flex w-full flex-col justify-between gap-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormMessage className="text-xs text-red-600 dark:text-red-400" />
                  <FormControl>
                    <Input autoComplete="off" {...field} />
                  </FormControl>
                  <FormDescription>
                    What should your form be called?
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormMessage className="text-xs text-red-600 dark:text-red-400" />
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the form namespace inside you workspace.
                  </FormDescription>
                </FormItem>
              )}
            />
            <Button
              className="mt-4"
              disabled={createEndpoint.isLoading}
              type="submit"
            >
              {createEndpoint.isLoading ? (
                <LoadingIcon className="size-8" />
              ) : (
                <div className="group flex flex-row w-full items-center justify-center gap-2">
                  <span>Let&apos;s Build</span>{' '}
                  <ArrowRightIcon className="transition-all w-0 group-hover:w-6" />
                </div>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
