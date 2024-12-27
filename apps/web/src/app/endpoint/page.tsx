import {BlurFade} from '@/components/blur-fade';
import Image from 'next/image';
import Link from 'next/link';

import notFoundIcon from '@public/not-found.webp';
import pausedIcon from '@public/paused.webp';
import checkIcon from '@public/check.webp';
import errorIcon from '@public/error.webp';

interface Props {
  searchParams: {
    type: 'not-found' | 'bad-request' | 'thanks-you' | 'disabled';
  };
}

const title = {
  'not-found': 'Form Not Found',
  'bad-request': 'Bad Request',
  'thanks-you': 'Thanks For Your Submission',
  disabled: 'Form Disabled'
} as const;

const description = {
  'not-found': 'the form does not exists, ensure that is correctly typed',
  'bad-request': 'invalid request, please check the body of the form',
  disabled: 'the form is currently not accepting submissions',
  'thanks-you': 'your submission has been sent correctly'
} as const;

const image = {
  disabled: pausedIcon,
  'thanks-you': checkIcon,
  'bad-request': errorIcon,
  'not-found': notFoundIcon
};

export default function Page({searchParams}: Props) {
  const {type} = searchParams;

  return (
    <BlurFade
      delay={0.3}
      className="flex flex-grow w-full items-center justify-center flex-col px-4"
    >
      <header className="mb-8 flex flex-col items-center sm:items-start gap-8">
        <figure className="rounded-[0.85rem] border-4 dark:border-2 overflow-hidden dark:border-neutral-600 border-neutral-300 shadow-md dark:shadow-neutral-950">
          <Image alt="" height={64} src={image[type]} width={64} />
        </figure>
      </header>
      <h1 className="font-bold text-2xl sm:text-4xl">{title[type]}</h1>
      <h2 className="font-secondary text-lg mt-4">{description[type]}</h2>
      {type === 'thanks-you' ? (
        <Link
          href="/"
          className="absolute bottom-8 text-sm text-neutral-400 dark:text-neutral-600 hover:underline"
        >
          Powered By Formizee
        </Link>
      ) : (
        <a
          className="absolute bottom-8 text-sm mt-8 text-neutral-600 dark:text-neutral-400 hover:underline"
          href="mailto:support@formizee.com"
        >
          Contact Support
        </a>
      )}
    </BlurFade>
  );
}
