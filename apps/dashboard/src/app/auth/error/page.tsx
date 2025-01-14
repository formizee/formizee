import {UndoIcon} from '@formizee/ui/icons';
import {Transition} from '@/components';
import {Button} from '@formizee/ui';
import Image from 'next/image';
import Link from 'next/link';
import {z} from 'zod';

import lockIcon from '@/../public/lock.webp';

const errorParamsSchema = z.object({
  error: z.string().optional().default('/')
});

const generateErrorLabel = (data: {error: string} | undefined) => {
  const error = data?.error ?? '';

  switch (error) {
    case 'Configuration':
      return {
        title: 'Oops, something was wrong...',
        message:
          'There is a problem with the server configuration. Please contact the support team.'
      };
    case 'Disabled':
      return {
        title: 'Formizee Private Beta',
        message:
          'New logins are disabled, wait until we launch a public release or join in our closed beta waitlist.'
      };
    case 'AccessDenied':
      return {
        title: 'Access denied for this workspace',
        message:
          'You do not have the necessary permissions to access this page. If you believe this is an error, please contact support.'
      };
    case 'Verification':
      return {
        title: 'Account verification failed',
        message:
          'The token provided has either expired or has already been used. Please request a new token and try again.'
      };
    default:
      return {
        title: 'Oops, something was wrong...',
        message:
          'An unexpected error occurred. Please try again later. If the problem persists, contact technical support.'
      };
  }
};

export default async function AuthError({
  searchParams
}: {
  searchParams: {[key: string]: string | string[] | undefined};
}) {
  const data = errorParamsSchema.safeParse(searchParams);
  const error = generateErrorLabel(data.data);

  return (
    <main className="w-full flex flex-col min-h-screen gap-4 items-center justify-center p-24">
      <Transition className="flex flex-col max-w-[50rem] gap-4">
        <header className="mb-8 flex w-full flex-col items-center sm:items-start gap-8">
          <div className="dark:reflection dark:shadow-[0_0_60px_15px_rgba(220,38,38,0.2)]">
            <Image
              priority
              alt="Email"
              className="z-[999] rounded-xl border-4 dark:border-neutral-600 border-neutral-300 shadow-[0_0_60px_22px_rgba(220,38,38,0.3)]"
              src={lockIcon}
              height={64}
              width={64}
            />
          </div>
          <h1 className="text-balance text-center text-neutral-950 dark:text-neutral-50 font-bold text-xl sm:text-xl">
            {error.title}
          </h1>
        </header>
        <section className="flex flex-col gap-4 items-center max-w-[500px]">
          <p className="text-balance text-center text-neutral-700 dark:text-neutral-300">
            {error.message}
          </p>
          <Button asChild className="group mt-4 w-full max-w-96">
            <Link href="/">
              Go Back
              <UndoIcon className="transition-all -ml-2 group-hover:ml-0 w-0 opacity-0 group-hover:w-4 group-hover:opacity-100" />
            </Link>
          </Button>
          <span className="text-xs text-neutral-600 dark:text-neutral-400 mt-2">
            Need help?{'  '}
            <Link
              className="transition-colors underline-offset-2 underline hover:text-neutral-950 dark:hover:text-neutral-50"
              href="mailto:support@formizee.com"
            >
              Contact support
            </Link>
          </span>
        </section>
      </Transition>
    </main>
  );
}
