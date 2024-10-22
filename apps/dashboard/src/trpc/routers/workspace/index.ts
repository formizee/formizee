import {router} from '@/trpc';

//Routes
import {getWorkspaceBySlug} from './get';
import {getWorkspaceMembers} from './get-members';
import {updateWorkspaceName} from './update-name';
import {updateWorkspaceSlug} from './update-slug';

export const workspaceRouter = router({
  getBySlug: getWorkspaceBySlug,
  getMembers: getWorkspaceMembers,
  updateName: updateWorkspaceName,
  updateSlug: updateWorkspaceSlug
});
