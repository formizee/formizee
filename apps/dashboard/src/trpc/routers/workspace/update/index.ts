import {router} from '@/trpc';

//Routes
import {updateWorkspaceName} from './name';
import {updateWorkspaceSlug} from './slug';

export const updateWorkspaceRouter = router({
  name: updateWorkspaceName,
  slug: updateWorkspaceSlug
});
