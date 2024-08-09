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
import {z} from 'zod';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@formizee/ui/form';
import {api} from '@/trpc/client';
import {redirect} from 'next/navigation';
import {generateSlug} from 'random-word-slugs';

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

export const CreateButton = (props: {workspaceSlug: string}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: generateSlug(2)
    }
  });

  const onSubmit = form.handleSubmit(async data => {
    try {
      const newEndpoint = await api.endpoint.create.mutate({
        workspaceSlug: props.workspaceSlug,
        targetEmails: [],
        ...data
      });

      redirect(`/${props.workspaceSlug}/${newEndpoint.slug}`);
    } catch (error) {
      const err = error as Error;
      toast({
        title: err.name,
        variant: 'destructive',
        description: err.message
      });
    }
  });

  return (
    <div className="flex flex-col">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            <div className="flex flex-row w-full justify-start items-center gap-2">
              <DocumentAddIcon />
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
                  onSubmit={onSubmit}
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
                        <FormMessage className="text-xs" />
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          This is the form namespace inside you workspace.
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
