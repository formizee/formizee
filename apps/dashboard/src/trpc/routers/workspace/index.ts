import {router} from '@/trpc';

//Routes
import {getWorkspaceBySlug} from './get';
import {getWorkspaceMembers} from './get-members';
import {updateWorkspaceName} from './update-name';
import {updateWorkspaceSlug} from './update-slug';
import {getWorkspaceLimits} from './get-limits';

export const workspaceRouter = router({
  getBySlug: getWorkspaceBySlug,
  getMembers: getWorkspaceMembers,
  getLimits: getWorkspaceLimits,
  updateName: updateWorkspaceName,
  updateSlug: updateWorkspaceSlug
});
