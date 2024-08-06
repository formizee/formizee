'use client';

import {ArrowRightIcon, DocumentAddIcon} from '@formizee/ui/icons';
import {
  Input,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  toast
} from '@formizee/ui';
import {zodResolver} from '@hookform/resolvers/zod';
import {Form, useForm} from 'react-hook-form';
import {parseTrpcError, trpc} from '@/trpc';
import {useRouter} from 'next/navigation';
import {z} from 'zod';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@formizee/ui/form';

const formSchema = z.object({
  name: z
    .string()
    .min(4, 'Name is required and should be at least 4 characters')
    .max(64)
});

export const CreateButton = (props: {workspaceSlug: string}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });
  //const router = useRouter();

  //const createEndpoint = trpc.endpoint.create.useMutation({
  //onSuccess: async ({ workspace, endpoint }) => {
  //router.push(`${workspace}/${endpoint}`);
  //},
  //onError(err) {
  //console.error(err);
  //}
  //});

  return (
    <div className="flex flex-col">
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <div className="flex flex-row w-full justify-start items-center gap-2">
              <DocumentAddIcon className="fill-neutral-950" />
              Create a new form
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-left font-semibold">
              Create New Form
            </DialogTitle>
            <DialogDescription className="text-left">
              Give your form a catchy name that captures its essence. This will
              be your form&apos;s headline act!
            </DialogDescription>
            <DialogFooter>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(values =>
                    createEndpoint.mutate({
                      workspaceSlug: props.workspaceSlug,
                      ...values
                    })
                  )}
                  className="flex w-full flex-row justify-between gap-x-4 pt-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormMessage className="text-xs" />
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          What should your workspace be called?
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <Button type="submit">
                    <span>Let&apos;s Build</span> <ArrowRightIcon />
                  </Button>
                </form>
              </Form>
            </DialogFooter>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};
