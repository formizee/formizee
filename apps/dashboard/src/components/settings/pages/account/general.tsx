import Transition from '@/components/transition';
import {Button, Input, Label, Separator} from '@formizee/ui';
import {api} from '@/trpc/client';

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
        <div className="flex flex-row items-center px-4 justify-center size-14 rounded-md bg-neutral-600 dark:bg-neutral-400">
          <span className="fixed text-lg text-neutral-50 dark:text-neutral-950 font-semibold">
            {user.name.split('')[0]?.toUpperCase()}
          </span>
        </div>
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
          <Input id="name" className="w-96" value={user.name} />
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
          <Input id="slug" className="w-96" value={user.slug} />
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
          <Input id="id" disabled className="w-96" value={user.id} />
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
