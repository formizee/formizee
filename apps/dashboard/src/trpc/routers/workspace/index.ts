import {router} from '@/trpc';
//
//Routes
import {getWorkspaceBySlug} from './get';
import {getWorkspaceMembers} from './get-members';

export const workspaceRouter = router({
  getBySlug: getWorkspaceBySlug,
  getMembers: getWorkspaceMembers
});
