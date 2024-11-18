import {router} from '@/trpc';

// Procedures
import {updateUserName} from './update-name';
import {updateUserSlug} from './update-slug';
import {getUserEmails} from './get-emails';
import {getUser} from './get';

export const userRouter = router({
  updateName: updateUserName,
  updateSlug: updateUserSlug,
  getEmails: getUserEmails,
  get: getUser
});
