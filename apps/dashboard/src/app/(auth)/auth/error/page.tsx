import {CloseIcon} from '@formizee/ui/icons';
import {Button} from '@formizee/ui';
import Link from 'next/link';
import {z} from 'zod';

const errorParamsSchema = z.object({
  error: z.string().optional().default('/')
});

export default async function AuthError({
  searchParams
}: {
  searchParams: {[key: string]: string | string[] | undefined};
}) {
  const error = errorParamsSchema.safeParse(searchParams);

  const generateErrorLabel = (data: {error: string} | undefined) => {
    const error = data?.error ?? '';

    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration.';
      case 'AccessDenied':
        return 'The access to this page is restricted.';
      case 'Verification':
        return 'The token has expired or has already been used.';
      default:
        return 'A internal error happened, please try again.';
    }
  };

  const errorLabel = generateErrorLabel(error?.data);

  return (
    <main className="w-full flex flex-col min-h-screen gap-4 items-center justify-center p-24">
      <CloseIcon className="fill-red-500 size-10" />
      <h1 className="text-2xl font-medium">Oops, something was wrong...</h1>
      <p className="text-lg font-mono text-red-500">{errorLabel}</p>
      <section className="flex flex-col mt-8 ">
        <Button asChild>
          <Link href="/login">Retry</Link>
        </Button>
      </section>
    </main>
  );
}
