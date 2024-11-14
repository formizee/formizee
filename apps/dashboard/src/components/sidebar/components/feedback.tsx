'use client';

import {ArrowRightIcon, ChatIcon, LoadingIcon} from '@formizee/ui/icons';
import chatIcon from '@/../public/chat.webp';
import Image from 'next/image';

import {
  Dialog,
  Button,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  Textarea,
  DialogHeader,
  toast
} from '@formizee/ui';
import {z} from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@formizee/ui/form';
import {useState} from 'react';
import {SidebarMenuButton, SidebarMenuItem} from '@formizee/ui/sidebar';

const formSchema = z.object({
  description: z
    .string()
    .min(4, 'The description is required and should be at least 4 characters')
    .max(2000)
});

export const Feedback = () => {
  const [isLoading, _setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: ''
    }
  });

  const onSubmit = form.handleSubmit(_data => {
    form.reset();
    toast({
      title: 'Thanks!',
      variant: 'success',
      description: 'Your feedback has been sended correctly.'
    });
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <SidebarMenuItem>
          <SidebarMenuButton className="transition-colors text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800">
            <ChatIcon />
            Feedback
          </SidebarMenuButton>
        </SidebarMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="w-full flex flex-col gap-6 items-center text-left text-xl font-bold">
            <Image
              src={chatIcon}
              alt="Chat Icon"
              width={64}
              height={64}
              className="dark:rounded-[0.65rem] rounded-xl border-4 dark:border dark:border-neutral-600 border-neutral-300 shadow-md shadow-neutral-950"
            />
            Tell us your experience...
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
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      className="h-32"
                      placeholder="Ideas to improve this page..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-600 dark:text-red-400" />
                </FormItem>
              )}
            />
            <Button className="mt-4" disabled={isLoading} type="submit">
              {isLoading ? (
                <LoadingIcon className="size-8" />
              ) : (
                <div className="group flex flex-row w-full items-center justify-center gap-2">
                  <span>Send Feedback</span>{' '}
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
