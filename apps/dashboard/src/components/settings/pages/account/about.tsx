import {HeartIcon, LinkIcon} from '@formizee/ui/icons';
import {Button, Label, Separator} from '@formizee/ui';
import Transition from '@/components/transition';
import infoIcon from '@/../public/info.webp';
import appPackage from '@/../package.json';
import Image from 'next/image';
import Link from 'next/link';

export const SettingsAccountInfo = () => {
  return (
    <Transition className="flex flex-col w-full">
      <div className="flex gap-4 my-4">
        <Image
          priority
          height={48}
          width={48}
          src={infoIcon}
          alt="Info Icon"
          className="z-[999] size-14 dark:border-2 rounded-xl border-4 dark:border dark:border-neutral-600 border-neutral-300 shadow-md shadow-neutral-950"
        />
        <div className="flex flex-col max-w-96">
          <span className="font-regular truncate mr-2">{'Info & Others'}</span>
          <span className="font-secondary text-sm text-neutral-600 dark:text-neutral-400 font-regular mt-1">
            Legal information about the app and others.
          </span>
        </div>
      </div>
      <h1 className="font-semibold mt-4">Documents</h1>
      <Separator className="mt-2 w-full" />
      <div className="flex justify-between items-end gap-2 mt-4">
        <div className="flex flex-col gap-2">
          <Label className="text-sm">Privacy Policy</Label>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            Here is our privacy policy, if you want to check it, it’s all yours.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link
            href="https://formizee.com/legal/privacy-policy"
            target="_blank"
          >
            View
            <LinkIcon />
          </Link>
        </Button>
      </div>
      <div className="flex justify-between items-end gap-2 mt-4">
        <div className="flex flex-col gap-2">
          <Label className="text-sm">Terms Of Service</Label>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            Our terms and conditions of the software.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link
            href="https://formizee.com/legal/terms-of-service"
            target="_blank"
          >
            View
            <LinkIcon />
          </Link>
        </Button>
      </div>
      <h1 className="font-semibold mt-8">Others</h1>
      <Separator className="mt-2 w-full" />
      <div className="flex justify-between items-end gap-2 mt-4">
        <div className="flex flex-col gap-2">
          <Label className="text-sm">Sponsor This Project</Label>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            Help with a little donation!
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="https://github.com/sponsors/formizee" target="_blank">
            Sponsor
            <HeartIcon />
          </Link>
        </Button>
      </div>
      <div className="flex justify-between items-end gap-2 mt-4">
        <div className="flex flex-col gap-2">
          <Label className="text-sm">Software License</Label>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            Apache 2.0
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link
            href="https://github.com/formizee/formizee/blob/main/LICENSE"
            target="_blank"
          >
            View
            <LinkIcon />
          </Link>
        </Button>
      </div>
      <div className="flex justify-between items-end gap-2 mt-4">
        <div className="flex flex-col gap-2">
          <Label className="text-sm">App Version</Label>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            {appPackage.version} (Beta)
          </p>
        </div>
      </div>
    </Transition>
  );
};
