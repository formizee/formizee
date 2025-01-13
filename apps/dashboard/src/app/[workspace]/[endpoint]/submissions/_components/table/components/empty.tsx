import {LinkIcon} from '@formizee/ui/icons';
import {Transition} from '@/components';
import {Button} from '@formizee/ui';
import Image from 'next/image';

import formIcon from '@/../public/form.webp';
import Link from 'next/link';

export const SubmissionsEmpty = () => {
  return (
    <Transition className="flex flex-col items-center justify-center border dark:border-neutral-800 w-full h-[450px] mt-4 rounded-md">
      <Image
        priority
        src={formIcon}
        alt="Form Icon"
        width={64}
        height={64}
        className="dark:rounded-[0.65rem] rounded-xl border-4 dark:border dark:border-neutral-600 border-neutral-300 shadow-md shadow-neutral-950"
      />
      <span className="px-4 w-full flex flex-col text-center gap-6 items-center text-left text-xl font-bold mt-8">
        There's no submissions yet
      </span>
      <p className="max-w-[500px] text-sm px-4 mt-4 text-center text-balance text-neutral-600 dark:text-neutral-400">
        Looks empty? Check the documentation to learn how to start receiving
        submissions.
      </p>
      <Button className="mt-8" variant="outline" asChild>
        <Link href="https://docs.formizee.com" target="_blank">
          See The Docs
          <LinkIcon />
        </Link>
      </Button>
    </Transition>
  );
};
