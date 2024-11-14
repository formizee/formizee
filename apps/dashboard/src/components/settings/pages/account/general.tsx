import {Button, Input, Label, Separator} from '@formizee/ui';
import Transition from '@/components/transition';
import accountIcon from '@/../public/user.webp';
import {api} from '@/trpc/client';
import Image from 'next/image';

interface Props {
  userId: string;
}

export const SettingsAccountGeneral = (props: Props) => {
  const user = api.user.get.useQuery({id: props.userId}).data;

  if (!user) {
    return;
  }

  return (
    <Transition className="flex flex-col w-full">
      <div className="flex gap-4 my-4">
        <Image
          height={48}
          width={48}
          src={accountIcon}
          alt="User Icon"
          className="z-[999] size-14 dark:border-2 rounded-xl border-4 dark:border dark:border-neutral-600 border-neutral-300 shadow-md shadow-neutral-950"
        />
        <div className="flex flex-col max-w-96">
          <span className="font-regular truncate mr-2">{user.name}</span>
          <span className="text-sm text-neutral-600 dark:text-neutral-400 font-regular max-w-[12.5rem] truncate">
            {user.slug}
          </span>
        </div>
      </div>
      <h1 className="font-semibold mt-4">Profile Information</h1>
      <Separator className="mt-2 w-full" />
      <div className="flex items-end gap-2 mt-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name" className="text-sm">
            Display Name
          </Label>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            This name will be visible by the members of your workspaces.
          </p>
          <Input id="name" className="w-96" defaultValue={user.name} />
        </div>
        <Button variant="outline">Update</Button>
      </div>
      <div className="flex items-end gap-2 mt-8">
        <div className="flex flex-col gap-2">
          <Label htmlFor="slug" className="text-sm">
            Username
          </Label>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            This is your URL namespace within Formizee.
          </p>
          <Input id="slug" className="w-96" defaultValue={user.slug} />
        </div>
        <Button variant="outline">Update</Button>
      </div>
      <div className="flex items-end gap-2 mt-8">
        <div className="flex flex-col gap-2">
          <Label htmlFor="id" className="text-sm">
            Formizee ID
          </Label>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            This is your user ID within Formizee.
          </p>
          <Input id="id" disabled className="w-96" defaultValue={user.id} />
        </div>
        <Button variant="outline">Copy</Button>
      </div>
      <div className="flex flex-col items-start gap-2 mt-8">
        <div className="flex flex-col gap-2">
          <span className="text-sm">Delete Account</span>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-[500px]">
            Permanently remove your Personal Account and all of its contents
            from Formizee. This action is not reversible, so please continue
            with caution.
          </p>
        </div>
        <Button variant="destructive" className="mt-2">
          Delete Permanently
        </Button>
      </div>
    </Transition>
  );
};
