'use client';

import {LoadingIcon} from '@formizee/ui/icons';
import keyIcon from '@/../public/key.webp';
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
  newName: z
    .string()
    .min(4, 'The name should be between 4 and 64 characters')
    .max(64, 'The name should be between 4 and 64 characters')
});

export const UpdateKeyDialog = ({keyId, isOpen, onOpenChange}: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  const router = useRouter();

  const updateKey = api.key.update.useMutation({
    onError: error => {
      toast({
        variant: 'destructive',
        description: error.message,
        title: "Key can't be renamed"
      });
    },
    onSuccess: () => {
      router.refresh();
    }
  });

  const onSubmit = form.handleSubmit(data => {
    updateKey.mutate({
      id: keyId,
      name: data.newName
    });
  });
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="mb-4">
          <DialogTitle className="w-full flex flex-col gap-6 items-center text-left text-xl font-bold">
            <Image
              src={keyIcon}
              alt="Trash Icon"
              width={64}
              height={64}
              className="dark:rounded-[0.65rem] rounded-xl border-4 dark:border dark:border-neutral-600 border-neutral-300 shadow-md shadow-neutral-950"
            />
            Rename Key
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={onSubmit}
            className="flex w-full flex-col justify-between gap-y-4"
          >
            <FormField
              control={form.control}
              name="newName"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <Input
                      required
                      autoComplete="off"
                      placeholder="My Personal Key..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <Button
              className="mt-4"
              disabled={updateKey.isLoading}
              type="submit"
            >
              {updateKey.isLoading ? (
                <LoadingIcon className="size-8" />
              ) : (
                <div className="group flex flex-row w-full items-center justify-center gap-2">
                  Update Name
                </div>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
