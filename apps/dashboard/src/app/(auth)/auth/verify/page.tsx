import {MailIcon} from '@formizee/ui/icons';
import {auth} from '@/lib/auth';
import {redirect} from 'next/navigation';

export default async function AuthVerify() {
  const session = await auth();

  if (session) {
    redirect('/');
  }

  return (
    <main className="w-full flex flex-col min-h-screen gap-4 items-center justify-center p-24">
      <MailIcon className="size-10" />
      <h1 className="text-2xl">Check Your Inbox</h1>
      <section className="flex flex-col gap-4 items-center">
        <p className="text-lg">
          A sign in link has been sent to your email address.
        </p>
      </section>
    </main>
  );
}
