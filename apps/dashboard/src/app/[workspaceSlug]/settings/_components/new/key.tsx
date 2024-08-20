'use client';

import {ArrowRightIcon, LoadingIcon, PlusIcon} from '@formizee/ui/icons';
import keyIcon from '@/../public/key.webp';
import Image from 'next/image';

import {zodResolver} from '@hookform/resolvers/zod';
import * as schema from '@formizee/db/schema';
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
  DialogTrigger,
  toast,
  SelectTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectValue
} from '@formizee/ui';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@formizee/ui/form';
import {useRouter} from 'next/navigation';

const formSchema = z.object({
  name: z
    .string()
    .min(4, {message: 'The name must be between 4 and 64 characters long.'})
    .max(64, {message: 'The name must be between 4 and 64 characters long.'}),
  expiresAt: z.enum(schema.apiKeyExpirationDate)
});

export const CreateKeyButton = (props: {workspaceSlug: string}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      expiresAt: '90-days'
    }
  });

  const router = useRouter();

  const createKey = api.key.create.useMutation({
    onError: error => {
      toast({
        variant: 'destructive',
        description: error.message,
        title: "API Key can't be created"
      });
    },
    onSuccess: async () => {
      router.refresh();
    }
  });

  const onSubmit = form.handleSubmit(data =>
    createKey.mutate({
      workspaceSlug: props.workspaceSlug,
      ...data
    })
  );

  return (
    <div className="flex flex-col">
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            Create New Key
            <PlusIcon />
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-lg border-neutral-200 dark:border-neutral-800">
          <DialogHeader>
            <DialogTitle className="w-full flex flex-col gap-6 items-center text-left text-xl font-bold">
              <Image
                src={keyIcon}
                alt="Key Icon"
                width={64}
                height={64}
                className="dark:rounded-[0.65rem] rounded-xl border-4 dark:border dark:border-neutral-600 border-neutral-300 shadow-md shadow-neutral-950"
              />
              Create New Key
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
                      What should your key be called?
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiresAt"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Expires At</FormLabel>
                    <FormMessage className="text-xs text-red-600 dark:text-red-400" />
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a date" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup defaultValue="90-days">
                          <SelectItem value="1-day">1 Day</SelectItem>
                          <SelectItem value="7-days">7 Days</SelectItem>
                          <SelectItem value="30-days">30 Days</SelectItem>
                          <SelectItem value="60-days">60 Days</SelectItem>
                          <SelectItem value="90-days">90 Days</SelectItem>
                          <SelectItem value="180-days">180 Days</SelectItem>
                          <SelectItem value="1-year">1 Year</SelectItem>
                          <SelectItem value="never">
                            Never (Not Recommended)
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How long this key will work?
                    </FormDescription>
                  </FormItem>
                )}
              />
              <Button
                className="mt-4"
                disabled={createKey.isLoading}
                type="submit"
              >
                {createKey.isLoading ? (
                  <LoadingIcon className="size-8" />
                ) : (
                  <div className="group flex flex-row w-full items-center justify-center gap-2">
                    <span>Create API Key</span>{' '}
                    <ArrowRightIcon className="transition-all w-0 group-hover:w-6" />
                  </div>
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
