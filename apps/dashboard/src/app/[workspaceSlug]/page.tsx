import {redirect} from 'next/navigation';

interface Params {
  workspaceSlug: string;
}

const DashboardRedirect = async ({params}: {params: Params}) => {
  redirect(`/${params.workspaceSlug}`);
};

export default DashboardRedirect;
