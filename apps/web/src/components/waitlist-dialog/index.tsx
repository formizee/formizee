'use client';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
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
import {LoadingIcon} from '@formizee/ui/icons';

import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {useState} from 'react';
import {z} from 'zod';
import {joinWaitlist} from './actions';

const formSchema = z.object({
  email: z.string().email()
});

export function WaitlistDialog(props: {children: React.ReactNode}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = form.handleSubmit(async data => {
    setLoading(true);
    const {error} = await joinWaitlist(data.email);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message
      });
      setLoading(false);
      return;
    }

    toast({
      title: 'You are in!',
      description:
        'thanks for join with us, we will sent you an email when Formizee is ready.'
    });
    setLoading(false);
    setOpen(false);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="border-2">
        <DialogHeader className="flex items-center gap-2">
          <DialogTitle className="w-full flex flex-col items-center text-xl font-bold">
            Join In The Waitlist
          </DialogTitle>
          <DialogDescription className="font-secondary text-sm">
            We will send you an email when the public beta is released.
          </DialogDescription>
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
                  <FormLabel className="text-neutral-600 dark:text-neutral-400">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      required
                      type="email"
                      placeholder="name@email.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <Button
              className="mt-4 font-secondary border-2 hover:border-neutral-500 dark:hover:border-neutral-400 hover:bg-neutral-800 dark:hover:bg-neutral-300 border-neutral-700 dark:border-neutral-300 bg-neutral-900 dark:bg-neutral-100"
              disabled={loading}
              type="submit"
            >
              {loading ? (
                <LoadingIcon className="size-8" />
              ) : (
                <div className="group flex flex-row w-full items-center justify-center gap-2">
                  Confirm
                </div>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
