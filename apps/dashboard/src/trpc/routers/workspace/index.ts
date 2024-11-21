import {updateWorkspaceRouter} from './update';
import {router} from '@/trpc';

//Routes
import {getWorkspaceBySlug} from './get';
import {getWorkspaceMembers} from './members';
import {getWorkspaceLimits} from './limits';

export const workspaceRouter = router({
  update: updateWorkspaceRouter,
  members: getWorkspaceMembers,
  limits: getWorkspaceLimits,
  get: getWorkspaceBySlug
});
