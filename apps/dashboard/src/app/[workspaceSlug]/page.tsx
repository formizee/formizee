import 'server-only';
import {notFound, redirect} from 'next/navigation';
import {auth} from '@/lib/auth';
import {api} from '@/trpc/server';

interface Params {
  workspaceSlug: string;
}

const DashboardRedirect = async ({params}: {params: Params}) => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const workspace = await api.workspace.getBySlug.query({
    slug: params.workspaceSlug
  });

  if (!workspace) {
    return notFound();
  }

  redirect(`/${workspace.slug}`);
};

export default DashboardRedirect;
