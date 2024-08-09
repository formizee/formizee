import {router} from '@/trpc';
//
//Routes
import {getWorkspaceBySlug} from './get';

export const workspaceRouter = router({
  getBySlug: getWorkspaceBySlug
});
