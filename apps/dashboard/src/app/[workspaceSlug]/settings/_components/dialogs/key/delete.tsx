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
import {useRouter} from 'next/navigation';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';

interface Props {
  onOpenChange: ((open: boolean) => void) | undefined;
  isOpen: boolean;
  keyId: string;
}

const formSchema = z.object({
  description: z.enum(['delete my key'], {
    message: 'The input does not match.'
  })
});

export const DeleteKeyDialog = ({keyId, isOpen, onOpenChange}: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  const router = useRouter();

  const deleteKey = api.key.delete.useMutation({
    onError: error => {
      toast({
        variant: 'destructive',
        description: error.message,
        title: "Key can't be deleted"
      });
    },
    onSuccess: () => {
      router.refresh();
    }
  });

  const onSubmit = form.handleSubmit(() => {
    deleteKey.mutate({id: keyId});
  });
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="mb-4">
          <DialogTitle className="w-full flex flex-col gap-6 items-center text-left text-xl font-bold">
            <Image
              src={trashIcon}
              alt="Trash Icon"
              width={64}
              height={64}
              className="dark:rounded-[0.65rem] rounded-xl border-4 dark:border dark:border-neutral-600 border-neutral-300 shadow-md shadow-neutral-950"
            />
            Delete Key
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
                    To verify, type <b>delete my key</b> below:
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
              disabled={deleteKey.isLoading}
              type="submit"
            >
              {deleteKey.isLoading ? (
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
