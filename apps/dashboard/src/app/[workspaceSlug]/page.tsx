import {handleTrpcServerAction} from '@/trpc/utils';
import {redirect} from 'next/navigation';
import {database} from '@/lib/db';
import {api} from '@/trpc/server';
import {auth} from '@/lib/auth';
import EmptyPage from './empty';
import 'server-only';

interface Params {
  workspaceSlug: string;
}

const DashboardRedirect = async ({params}: {params: Params}) => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const workspace = await handleTrpcServerAction(
    api.workspace.get.query({slug: params.workspaceSlug})
  );

  const endpoint = await database.query.endpoint.findFirst({
    where: (table, {eq}) => eq(table.workspaceId, workspace.id)
  });

  if (!endpoint) {
    return <EmptyPage />;
  }

  redirect(`/${workspace.slug}/${endpoint.slug}`);
};

export default DashboardRedirect;
