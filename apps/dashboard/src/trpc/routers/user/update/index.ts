import {router} from '@/trpc';

// Procedures
import {updateUserName} from './name';
import {updateUserSlug} from './slug';

export const updateUserRouter = router({
  name: updateUserName,
  slug: updateUserSlug
});

export default updateUserRouter;
