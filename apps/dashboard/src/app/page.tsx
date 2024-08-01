import {auth, signOut} from '@/lib/auth';
import {Button} from '@formizee/ui';
import {redirect} from 'next/navigation';

const Dashboard = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <main className="flex flex-col gap-4 min-h-screen items-center justify-center p-24">
      <h1 className="text-2xl">Dashboard</h1>
      <pre>{session.user.email}</pre>
      <form
        action={async () => {
          'use server';
          await signOut();
        }}
      >
        <Button type="submit" variant="destructive">
          Logout
        </Button>
      </form>
    </main>
  );
};

export default Dashboard;
